import socket, sys, time

print(sys.stdin.encoding)

HOST = '0.0.0.0'
PORT = 3500
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
print('sock was created')
print(time.ctime())
try:
    s.bind((HOST, PORT))
except Exception as ex:
    print (ex)
    sys.exit()

s.listen(10)

while 1:
    conn, addr = s.accept()
    print(time.ctime())
    print(addr[0], conn)
    with conn:
        print('receive message')
        while True:
            data = conn.recv(4096)
            if not data: break
            print(data.decode('utf8'))

s.close()
