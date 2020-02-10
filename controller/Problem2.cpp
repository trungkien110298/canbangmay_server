#include <bits/stdc++.h>

using namespace std;

const double eps = 1e-9;

const int MAXN = 100; // Maximum number of tasks
const int MAXGROUPSIZE = 3;
const double BALANCETHRESH = 4.0/5.0;
const int HMAX = 101;
const int NMAX = 1000;

const int STARTTEMP = 100;
const int DECTEMP = 5;
const int LOOPTIME = 20;

///* Read input

struct task{
    string machine;
    string machine_name;
    int type;
    double worktime;
    int status;
    int level;
    vector<int> edge, originEdge;
    vector<int> revEdge;
};

struct edge_du_phong{
    vector<int> edge, originEdge;
    vector<int> revEdge;
    int status;
};

struct group{
    int worker;
    int index;
    bool isStart = false;
    bool isEnd = false;
    vector<int> edge;
};

int N, NConst, sailech;
float R, Rmax, Rmin, RminNP = 0, totalTimeW = 0, RmaxNP = 0;
task taskList[MAXN + 5];
edge_du_phong edge_dp[MAXN + 5];
group groupList[3*MAXN + 5];

void readInput(){
    freopen("../temp/input_p2.txt", "r", stdin);
    freopen("../temp/output_p2.json", "w", stdout);

    cin >> N >> NConst >> sailech;
    for(int i = 1; i <= N; i++){
        int ign;
        cin >> ign >> taskList[i].machine >> taskList[i].type >> taskList[i].worktime >> taskList[i].level ;
        taskList[i].status = 1;
        edge_dp[i].status = 1;
        totalTimeW += taskList[i].worktime;
        if (RmaxNP < taskList[i].worktime) RmaxNP = taskList[i].worktime;
    }

    RmaxNP = RmaxNP * 3;
    RminNP = float(totalTimeW)/NConst;

    int M; cin >> M;
    while(M--){
        int u, v; cin >> u >> v;
        taskList[u].edge.push_back(v); taskList[u].originEdge.push_back(v);
        taskList[v].revEdge.push_back(u);
        edge_dp[u].edge.push_back(v); edge_dp[u].originEdge.push_back(v);
        edge_dp[v].revEdge.push_back(u);
    }

    /*for(int type = 1; type <= 3; type++){
        cin >> M;
        while(M--){
            string machine; cin >> machine;
            for(int i = 1; i <= N; i++){
                if(taskList[i].machine == machine) taskList[i].type = type;
            }
        }
    }*/


}

float round_float(float a){
    a = a*10;
    a = round(a);
    return a/10;
}

///* Find a good initial solution

struct solution{
    int workers;
    int balancedGroup;
    double balance;
    vector<vector<int> > groups;
};

struct gloFinalRes{
    solution globalFinalRes;
    float globalR;
};

gloFinalRes globalRes;
solution curRes, finalRes;

set<int> reachableTask;
set<int> groupElements;

bool dfs1(int u, int rev){
    if(rev == -1
       && groupElements.find(u) == groupElements.end()
       && reachableTask.find(u) != reachableTask.end())
        return true;

    reachableTask.insert(u * rev);

    if(rev == 1){
        for(int i = 0; i < (int)taskList[u].edge.size(); i++){
            int v = taskList[u].edge[i];
            if(taskList[v].status < 0) v = -taskList[v].status;
            if(reachableTask.find(v * rev) == reachableTask.end())
                dfs1(v, rev);
        }
    }
    else{
        for(int i = 0; i < (int)taskList[u].revEdge.size(); i++){
            int v = taskList[u].revEdge[i];
            if(taskList[v].status < 0) v = -taskList[v].status;
            if(reachableTask.find(v * rev) == reachableTask.end() && dfs1(v, rev))
                return true;
        }
    }

    return false;
}

int checkSize(vector<int> group){
    for(int i = 0; i < (int)group.size(); i++)
    {
        if(taskList[group[i]].worktime >= Rmin && taskList[group[i]].worktime <= Rmax ) return 1;
        if(taskList[group[i]].worktime >= 2*Rmin && taskList[group[i]].worktime <= 2*Rmax) return 2;

    }
    return false;
}

bool tooLargeOrBadPair(vector<int> group){
    // not more than MAXGROUPSIZE tasks
    if((int)group.size() > MAXGROUPSIZE) return true;

    // totalTime <= 3.3R
    double totalTime = 0;
    for(int i = 0; i < (int)group.size(); i++)
        totalTime += taskList[group[i]].worktime;

    int checkSizeGroup = checkSize(group);
    if (checkSizeGroup == 1){
        if((double)totalTime > Rmax) return true;
    }
    else if(checkSizeGroup == 2){
        if((double)totalTime >= 2 * Rmax) return true;
    }
    else{
        if((double)totalTime >= 3 * Rmax) return true;
    }

    // not more than 2 machine
    set<string> machine;
    for(int i = 0; i < (int)group.size(); i++)
        machine.insert(taskList[group[i]].machine);
    if((int)machine.size() > 2) return true;

    // no 1-1 or 1-2 pair
    set<int> type;
    for(int i = 0; i < (int)group.size(); i++)
        type.insert(taskList[group[i]].type);
    if((int)machine.size() == 2){
        if((int)type.size() == 1 && type.find(1) != type.end()) return true;
        if(type.find(1) != type.end() && type.find(2) != type.end()) return true;
    }

    //
    return false;
}

bool validGroup(vector<int> group){
    if(tooLargeOrBadPair((group))) return false;

    // no cycle between 2 groups
    reachableTask.clear();
    groupElements.clear();
    for(int i = 0; i < (int)group.size(); i++){
        groupElements.insert(group[i]);
        dfs1(group[i], 1);
    }
    for(int i = 0; i < (int)group.size(); i++)
        if(dfs1(group[i], -1)) return false;

    return true;
}

struct groupStat{
    int workers;
    int workerSaved;
    int balanced;
    int tasks;
    double TimeWork;
    double Rj;
};


groupStat calGroupStat(vector<int> group){
    groupStat stat;
    double totalTime = 0;
    int baseWorkers = 0;
    for(int i = 0; i < (int)group.size(); i++){
        totalTime += taskList[group[i]].worktime;
        double time = taskList[group[i]].worktime;
        if(time < Rmax) baseWorkers ++;
        else if(time < 2*Rmax) baseWorkers += 2;
        else baseWorkers += 3;
    }

    double actualWorkers = totalTime / (double)R;
    stat.TimeWork = totalTime;
    //stat.Rj = actualWorkers;
    if(totalTime < Rmax){
        stat.workers = 1;
        stat.workerSaved = baseWorkers - 1;
        //stat.balanced = (actualWorkers >= 0.85) ? 1 : 0;
    }
    else if(totalTime < 2*Rmax){
        stat.workers = 2;
        stat.workerSaved = baseWorkers - 2;
        //stat.balanced = (actualWorkers >= 1.75) ? 1 : 0;
    }
    else{
        stat.workers = 3;
        stat.workerSaved = baseWorkers - 3;
        //stat.balanced = (actualWorkers >= 2.65) ? 1 : 0;
    }
    stat.Rj = totalTime/stat.workers;
    stat.balanced = (stat.Rj >= Rmin && stat.Rj <= Rmax) ? 1 : 0;
    stat.tasks = (int)group.size();
    return stat;
}
vector<int> curBestGroup;

void cmpGroup(vector<int> group){
    groupStat curGroupStat = calGroupStat(group);
    groupStat curBestGroupStat = calGroupStat(curBestGroup);
    if(curGroupStat.workerSaved < curBestGroupStat.workerSaved) return;
    else if(curGroupStat.workerSaved > curBestGroupStat.workerSaved) curBestGroup = group;
    else{
        if(curGroupStat.balanced < curBestGroupStat.balanced) return;
        else if(curGroupStat.balanced > curBestGroupStat.balanced) curBestGroup = group;
        ///* Optional: choose smaller group if all available groups are unbalanced
        else{
            if(curGroupStat.balanced == 1) return;
            else if(curGroupStat.tasks < curBestGroupStat.tasks) curBestGroup = group;
        }
        //*/
    }
}

void findGroup(int t, vector<int> group, int lastTask){
    if(lastTask != 0){
        taskList[lastTask].status = 2;
        group.push_back(lastTask);
    }

    if(t == MAXGROUPSIZE){
        if(validGroup(group)) cmpGroup(group);
    }
    else{
        findGroup(t + 1, group, 0);
        for(int i = 1; i <= N; i++){
            if(taskList[i].status == 1){
                findGroup(t + 1, group, i);
            }
        }
    }

    if(lastTask != 0){
        taskList[lastTask].status = 1;
        group.pop_back();
    }
}

void calSolutionStat(solution* sol){
    (*sol).workers = 0;
    (*sol).balancedGroup = 0;
    for(int i = 0; i < (int)(*sol).groups.size(); i++){
        groupStat stat = calGroupStat((*sol).groups[i]);
        (*sol).workers += stat.workers;
        (*sol).balancedGroup += stat.balanced;
    }
    (*sol).balance = (double)(*sol).balancedGroup / (double)(*sol).groups.size();
}

void findSolution(){
    while(true){
    	bool remain = false;
    	int zeroInDegreeNode = -1;
    	for(int u = 1; u <= N; u++){
    		if(taskList[u].status != 1) continue;
    		bool zeroInDegree = true;
    		for(int i = 0; i < (int)taskList[u].revEdge.size(); i++){
    			int x = taskList[u].revEdge[i];
    			if(taskList[x].status <= 0) continue;
    			zeroInDegree = false;
    		}
    		if(zeroInDegree){
    			zeroInDegreeNode = u;
    			remain = true;
    			break;
    		}
    	}
    	if(!remain) break;

        int curNode = zeroInDegreeNode;
        curBestGroup.clear();
        curBestGroup.push_back(curNode);
        vector<int> group;
        findGroup(1, group, curNode);

        taskList[curNode].status = 0;
        for(int j = 1; j < (int)curBestGroup.size(); j++){
            int x = curBestGroup[j];
            for(int k = 0; k < (int)taskList[x].edge.size(); k++)
                taskList[curNode].edge.push_back(taskList[x].edge[k]);
            taskList[x].edge.clear();

            for(int k = 0; k < (int)taskList[x].revEdge.size(); k++)
                taskList[curNode].revEdge.push_back(taskList[x].revEdge[k]);
            taskList[x].revEdge.clear();

            taskList[x].status = -curNode;
        }

        curRes.groups.push_back(curBestGroup);
    }

    calSolutionStat(&curRes);
    finalRes = curRes;
}

///* Tune solution

int visit[MAXN + 5], visitCnt;

int findGroupIndex(int u, solution* sol){
    for(int i = 0; i < (int)(*sol).groups.size(); i++){
        for(int j = 0; j < (int)(*sol).groups[i].size(); j++){
            if((*sol).groups[i][j] == u) return i;
        }
    }
}

bool dfs2(int u, int curGroupIndex, solution* sol){
    visit[u] = visitCnt;
    int uGroupIndex = findGroupIndex(u, sol);

    for(int i = 0; i < (int)(*sol).groups[uGroupIndex].size(); i++){
        int v = (*sol).groups[uGroupIndex][i];
        if(visit[v] != visitCnt && dfs2(v, curGroupIndex, sol)) return true;
    }

    for(int i = 0; i < (int)taskList[u].originEdge.size(); i++){
        int v = taskList[u].originEdge[i], vGroupIndex = findGroupIndex(v, sol);
        if(uGroupIndex != curGroupIndex && vGroupIndex == curGroupIndex) return true;
        if(visit[v] == visitCnt) continue;
        if(dfs2(v, curGroupIndex, sol)) return true;
    }

    return false;
}

bool validSolution(solution* sol){
    for(int i = 0; i < (int)(*sol).groups.size(); i++)
        if(tooLargeOrBadPair((*sol).groups[i])) return false;

    // no cycle between 2 groups
    for(int i = 0; i < (int)(*sol).groups.size(); i++){
        visitCnt++;
        if(dfs2((*sol).groups[i][0], i, sol)) return false;
    }

    return true;
}


// cmpSolution() returns true if X > Y, false otherwise
bool cmpSolution(solution X, solution Y){
    if (X.workers <= NConst && Y.workers > NConst) return true;
    else if (X.workers > NConst && Y.workers <= NConst) return false;
    else if(X.workers == Y.workers) return X.balance > Y.balance;
    //else if(X.balance + eps < BALANCETHRESH && Y.balance + eps >= BALANCETHRESH) return false;
    else return X.workers < Y.workers;
}

bool cmpSolutionFinalR(solution X, solution Y){
    if (X.workers == NConst && Y.workers != NConst) return true;
    else if (X.workers != NConst && Y.workers == NConst) return false;
    else if(X.workers == Y.workers) return X.balance > Y.balance;
    //else if(X.balance + eps < BALANCETHRESH && Y.balance + eps >= BALANCETHRESH) return false;
    else return false;
}

void printSolution(solution a);

solution getNeighbor(int choice){
    vector<solution> solList;
    for(int i = 0; i < (int)curRes.groups.size(); i++){
        for(int j = 0; j < (int)curRes.groups[i].size(); j++){
            for(int k = 0; k < (int)curRes.groups.size()+1; k++){
                solution tempRes = curRes;
                if(k == i) continue;
                else if(k < (int)curRes.groups.size()){
                    tempRes.groups[k].push_back(tempRes.groups[i][j]);
                    tempRes.groups[i].erase(tempRes.groups[i].begin()+j);
                    if(tempRes.groups[i].empty()) tempRes.groups.erase(tempRes.groups.begin()+i);
                }
                else if((int)curRes.groups[i].size() > 1){
                    vector<int> tempVec; tempVec.push_back(tempRes.groups[i][j]);
                    tempRes.groups.push_back(tempVec);
                    tempRes.groups[i].erase(tempRes.groups[i].begin()+j);
                }
                else continue;

                // Check for better solution
                if(!validSolution(&tempRes)) continue;
                calSolutionStat(&tempRes);
                if (cmpSolutionFinalR(tempRes, globalRes.globalFinalRes))
                {
                    //printSolution(tempRes);
                    globalRes.globalFinalRes = tempRes;
                    globalRes.globalR = R;
                }
                if(cmpSolution(tempRes, finalRes) )
                {
                    //cout << "\nCac phuong an trung gian: \n";
                    finalRes = tempRes;
                    //printSolution(finalRes);

                }
                solList.push_back(tempRes);
            }
        }
    }

    // Choose "choice" best neighbors and randomly take one
    if(solList.empty()) return curRes;
    sort(solList.begin(), solList.end(), cmpSolution);
    while((int)solList.size() > choice) solList.pop_back();
    return solList[rand() % (int)solList.size()];
}



void tuneSolution(){
    ///* Simulated annealing
    srand(time(NULL));
    int temperature = STARTTEMP;
    int choice = (STARTTEMP - 1) / DECTEMP + 1;

    while(temperature > 0){
        for(int i = 1; i <= LOOPTIME; i++){
            solution tempRes = getNeighbor(choice);
            if(tempRes.groups == curRes.groups) break;
            if(cmpSolution(tempRes, curRes)){
                curRes = tempRes;
            }
            else if(rand() % STARTTEMP + 1 <= temperature) curRes = tempRes;
        }

        //printSolution(finalRes);
        temperature -= DECTEMP;
        choice--;
    }
    //*/


}

void resetAllVariable()
{

    //memset(visit, 0, sizeof visit);
    //visitCnt = 0;
    finalRes.balance = 0;
    finalRes.balancedGroup = 0;
    finalRes.groups.clear();
    finalRes.workers = 0;

    curRes.balance = 0;
    curRes.balancedGroup = 0;
    curRes.groups.clear();
    curRes.workers = 0;

    //curBestGroup.clear();
    //reachableTask.clear();
    //groupElements.clear();

    for(int i = 1; i <= N; i++){
        taskList[i].status = 1;
        taskList[i].edge.clear();
        taskList[i].originEdge.clear();
        taskList[i].revEdge.clear();
        for (int a1 = 0; a1 < edge_dp[i].edge.size(); a1++)
        {
            taskList[i].edge.push_back(edge_dp[i].edge[a1]);
        }
        for (int a1 = 0; a1 < edge_dp[i].originEdge.size(); a1++)
        {
            taskList[i].originEdge.push_back(edge_dp[i].originEdge[a1]);
        }
        for (int a1 = 0; a1 < edge_dp[i].revEdge.size(); a1++)
        {
            taskList[i].revEdge.push_back(edge_dp[i].revEdge[a1]);
        }
    }

}

void caculate_R(float res)
{
    R = res;
    if (sailech == 10){
        Rmin = R * 0.9;
        Rmax = R * 1.1;
    }
    else if (sailech == 15){
        Rmin = R * 0.85;
        Rmax = R * 1.15;
    }
    else{
        Rmin = R * 0.95;
        Rmax = R * 1.05;
    }
}

void ChatNhiPhanR(float RmaxNP,float RminNP){
    while(RminNP < RmaxNP - 0.5)
    {
        resetAllVariable();

        caculate_R(round_float((RmaxNP + RminNP)/2));
        //cout << "RmaxNP: " << RmaxNP << "  RminNP: " << RminNP << "  R: " << R << ", Rmax: " << Rmax << ",  Rmin: "<< Rmin <<endl;
        //printSolution(finalRes);

        findSolution();
        //cout <<  "Phuong an co so: " << endl;
        //printSolution(finalRes);
        tuneSolution();
        //cout <<  "Phuong an chot: " << endl;
        //printSolution(finalRes);

        if (finalRes.workers <= NConst )
        {
            //cout << "R: " << R << endl;
            //cout << "Phuong an trung gian: " << endl;
            //printSolution(finalRes);
            RmaxNP = R;
        }
        else RminNP ++;
    }
    caculate_R(globalRes.globalR);
    //cout << "Phuong an cuoi cung: " << endl;
    printSolution(globalRes.globalFinalRes);

}

///* Print final solution
/*
void printSolution(solution finalRes){
    int totalWorkers = 0;
    int totalWorkerSaved = 0;
    int balancedGroups = 0;

    for(int i = 0; i < (int)finalRes.groups.size(); i++)
        sort(finalRes.groups[i].begin(), finalRes.groups[i].end());
    sort(finalRes.groups.begin(), finalRes.groups.end());

    cout << (int)finalRes.groups.size() << " groups" << endl;
    for(int i = 0; i < (int)finalRes.groups.size(); i++){
        cout << "Group " << i + 1 << ":";
        for(int j = 0; j < (int)finalRes.groups[i].size(); j++){
            cout << " " << finalRes.groups[i][j];
        }

        groupStat stat = calGroupStat(finalRes.groups[i]);
        totalWorkers += stat.workers;
        balancedGroups += stat.balanced;
        totalWorkerSaved += stat.workerSaved;
        cout << " -- W: " << stat.workers << ", S: " << stat.workerSaved << ", T: " << stat.TimeWork <<", Nc: " << stat.Rj ;
        if(stat.balanced == 1) cout << " YES" << endl; else cout << " NO" << endl;
    }

    cout << totalWorkers << " workers, " << totalWorkerSaved << " saved, ";
    cout << 100.0 * (double)balancedGroups / (double)finalRes.groups.size() << "%" << endl;
}
*/
///* Print final solution

bool checkConnect(solution finalRes, int u, int v){
    vector<int> groupu;
    vector<int> groupv;
    groupu = finalRes.groups[u];
    groupv = finalRes.groups[v];
    for (int i = 0; i < groupu.size(); i++){
        int element_u = groupu[i];
        for (int j = 0; j < taskList[element_u].edge.size(); j++)
        {
            for (int k = 0; k < groupv.size(); k++)
            {
                if (taskList[element_u].edge[j] == groupv[k]){
                    return true;
                }
            }
        }
    }
    return false;
}

void line_arrangement(solution finalRes){
    int size_line = finalRes.groups.size();
    int group_index = 0;
    int degree[2*MAXN + 5] = {};
    for(int i = 0; i < size_line; i++){
        groupStat stat = calGroupStat(finalRes.groups[i]);
        for(int j = 0; j < stat.workers; j++)
        {
            group_index ++;
            groupList[group_index].worker = stat.workers;
            groupList[group_index].index = i;
            if (j == 0){
                groupList[group_index].isStart = true;
            }
            if (j == stat.workers - 1){
                groupList[group_index].isEnd = true;
            }
        }

        if (stat.workers == 2){
            groupList[group_index - 1].edge.push_back(group_index);
            degree[group_index] ++;
        }
        if (stat.workers == 3){
            groupList[group_index - 2].edge.push_back(group_index - 1);
            degree[group_index - 1] ++;
            groupList[group_index - 1].edge.push_back(group_index);
            degree[group_index] ++;
        }

    }

    for (int i = 1; i <= group_index; i++)
    {
        if (groupList[i].isEnd){
            int u = groupList[i].index;
            for (int j = 1; j <= group_index; j++){
                if (groupList[j].isEnd){
                    int v = groupList[j].index;
                    if (u != v && checkConnect(finalRes, u, v)){
                        groupList[i].edge.push_back(j);
                        degree[j] ++;
                    }
                }
                if ((!groupList[j].isStart && !groupList[j].isEnd))
                {
                    int v = groupList[j].index;
                    if (u != v && checkConnect(finalRes, u, v)){
                        groupList[i].edge.push_back(j);
                        degree[j] ++;
                    }
                }
            }
        }
        if (groupList[i].isStart)
        {
            int u = groupList[i].index;
            for (int j = 1; j <= group_index; j++){
                if (groupList[j].isStart){
                    if (groupList[i].worker > 1 || groupList[j].worker > 1)
                    {
                        int v = groupList[j].index;
                        if (u != v && checkConnect(finalRes, u, v)){
                            groupList[i].edge.push_back(j);
                            degree[j] ++;
                        }
                    }

                }
                if (groupList[i].worker != 1 && (!groupList[j].isStart && !groupList[j].isEnd))
                {
                    int v = groupList[j].index;
                    if (u != v && checkConnect(finalRes, u, v)){
                        groupList[i].edge.push_back(j);
                        degree[j] ++;
                    }
                }
            }
        }
        if (!groupList[i].isStart && !groupList[i].isEnd)
        {
            int u = groupList[i].index;
            for (int j = 1; j <= group_index; j++){
                if ((groupList[j].worker != 3)||(!groupList[j].isStart && !groupList[j].isEnd))
                {
                    int v = groupList[j].index;
                    if (u != v && checkConnect(finalRes, u, v)){
                        groupList[i].edge.push_back(j);
                        degree[j] ++;
                    }
                }

            }

        }
    }

    queue<int> arrange;
    int mark[2*MAXN + 5] = {};

    for (int i = 1 ; i <= group_index; i++)
    {
        /*
        cout <<"\n" << i <<" " << groupList[i].index<< " is Start: " << groupList[i].isStart << " is End: " << groupList[i].isEnd << " degree: " << degree[i] << endl ;
        for (int j = 0; j < groupList[i].edge.size(); j++){
            cout << groupList[i].edge[j] << " ";
        }
        cout << endl;
        */
        if (degree[i] == 0)
        {
            arrange.push(i);
            mark[i] = 1;
        }
    }

    int results[300] = {};

    int dem = 0;
    while (!arrange.empty()){
        int top = arrange.front();
        arrange.pop();
        dem++;
        results[dem] = top;
        //cout << groupList[top].index + 1;
        //if (dem % 2 == 0) cout << " ";
        //else cout << endl;
        mark[top] = 1;
        for (int i = 0; i < groupList[top].edge.size(); i++){
            int v = groupList[top].edge[i];
            if (!mark[v]){
                degree[v]--;
                if (degree[v] == 0) arrange.push(v);
            }
        }
    }

    cout << "\"array1\":[";
    for (int i = 1; i <= dem; i += 2){
        cout << "{\"id\": " << results[i] << ",";
        cout << "\"label\": " << groupList[results[i]].index + 1<< "}";
        if (i < dem-1) cout << ",";
    }
    cout << "], ";
    cout << "\"array2\":[";
    for (int i = 2; i <= dem; i += 2){
        cout << "{\"id\": " << results[i] << ",";
        cout << "\"label\": " << groupList[results[i]].index + 1<< "}";
        if (i < dem-1) cout << ",";
    }
    cout << "], ";
    cout << "\"edge\":[";
    int demphay = 0;
    for (int i = 1; i <= group_index; i++){

        for (int j = 0; j < groupList[i].edge.size(); j++){
            if (groupList[i].index != groupList[groupList[i].edge[j]].index)
            {
                if(demphay != 0) cout << ", ";
                demphay++;
                cout << "{\"u\": " << i << ",";
                cout << "\"v\": " << groupList[i].edge[j];
                //if (j < groupList[i].edge.size() - 1) cout << " ,";
                cout << "}";
                //if (i < group_index || j < groupList[i].edge.size() - 1) cout << ",";
            }
        }
    }
    cout << "]";
}

void printSolution(solution finalRes){
    int totalWorkers = 0;
    int totalWorkerSaved = 0;
    int balancedGroups = 0;

    for(int i = 0; i < (int)finalRes.groups.size(); i++)
        sort(finalRes.groups[i].begin(), finalRes.groups[i].end());
    sort(finalRes.groups.begin(), finalRes.groups.end());

    cout <<"{\"R\": " << R << ", ";
    cout <<"\"Numgroups\": " << (int)finalRes.groups.size() << ", ";

    cout <<"\"Groups\":[";
    for(int i = 0; i < (int)finalRes.groups.size(); i++){
        int levelmax = 0;
        cout << "{\"id\": " << i + 1 << ", ";
        cout << "\"tasks\":[";
        for(int j = 0; j < (int)finalRes.groups[i].size(); j++){
            int idtask = finalRes.groups[i][j];
            cout << "{\"task\":" << idtask << ", ";
            //cout << "\"NCCN\": \"" << taskList[idtask].machine_name << "\", ";
            cout << "\"machine\": \"" << taskList[idtask].machine << "\", ";
            cout << "\"ti\": " << taskList[idtask].worktime << "}";
            if (j < (int)finalRes.groups[i].size() - 1) cout <<",";
            if (levelmax < taskList[idtask].level) levelmax = taskList[idtask].level;
        }

        groupStat stat = calGroupStat(finalRes.groups[i]);
        totalWorkers += stat.workers;
        balancedGroups += stat.balanced;
        totalWorkerSaved += stat.workerSaved;
        cout << "],\"level\": " <<levelmax << ", ";
        cout << "\"total_time\": " << stat.TimeWork << ", ";
        cout << "\"workers\": " << stat.workers << ", ";
        cout << "\"Rj\": " << stat.Rj << ", ";
        //cout << " -- W: " << stat.workers << ", S: " << stat.workerSaved << ", T: " << stat.TimeWork <<", Nc: " << stat.Rj ;
        cout << "\"balance\": \"";
        if(stat.balanced == 1) cout << " Yes"; else cout << " No" ;
        cout << "\"}";
        if(i < (int)finalRes.groups.size() - 1) cout <<", ";
    }

    cout <<"], \"total_worker\": " <<totalWorkers << ",  \"total_save\": " << totalWorkerSaved << ",";
    cout <<"\"H\": " << 100.0 * (double)balancedGroups / (double)finalRes.groups.size() << ",";

    line_arrangement(finalRes);
    cout << "}" << endl;
}

int main(){
    readInput();
    /*R = RminNP;
    findSolution();
    cout << "R: " << R ;
    cout << "\nPhuong an co so: \n";
    printSolution(finalRes);
    tuneSolution();
    cout << "\nKet qua cuoi cung: \n";
    printSolution(finalRes);
    */
    ChatNhiPhanR(RmaxNP, RminNP);
    return 0;
}
