# canbangmay_server
## Hướng dẫn cách chạy file .cpp trên commandline
### Step 1: Installing the complier
* Tải và cài đặt [TDM-GCC MinGW Compiler](https://sourceforge.net/projects/tdm-gcc/)

### Step 2: Modifying System Variables 
* Tìm thư mục gốc chứa **TDM-GCC MinGW Compiler** vừa cài đặt, thường thì chương trình sẽ được cài đặt tại địa chỉ **C:\TDM-GCC**
* Vào thư mục **bin**
* Lấy địa chỉ của thư mục này **C:\TDM-GCC\bin**
* Bật commandline kiểm tra xem đã có gcc chưa bằng cách gõ **gcc** vào commandline. Nếu như cmd hiển thị **'gcc' is not recognized as an internal command** 
thì nghĩa là nó vẫn chưa được nhìn nhận, bạn cần điều chỉnh **system path variable** bằng cách thêm đường dẫn thư mục **bin** vào phần **Path** của **System variables**

### Final Step: Executing Hello World code
* Tạo một file có đuôi **.cpp** với nội dung in ra **"Hello World"**
* Giả sử ta tạo file có tên **code.cpp**
* Dùng **cmd** di chuyển đến thư mục chứa file **code.cpp**
* Sau khi di chuyển đến, ta gõ lệnh **g++ code.cpp -o code.exe**
* Sau khi lệnh thực hiện, file **code.exe** được tạo ra. Sau đó ta dùng **cmd** chạy file này bằng cách gõ tên file vào **cmd**.

### Chi tiết hướng dẫn
* Xem video trong [link](https://www.youtube.com/watch?v=TOeKtN6Vir4&fbclid=IwAR3ddTY1_qSMtxBMa4HfTLrEstaKwS0UrMpm_JI1XxhGD9EKQeM0GqQUUJI) 
