sudo brctl addbr kraft0
sudo ifconfig kraft0 172.88.0.1
sudo ifconfig kraft0 up

./qemu-guest.sh -k ./build/app-redis_kvm-x86_64 \
                -a "netdev.ipv4_addr=172.88.0.2 netdev.ipv4_gw_addr=172.88.0.1 netdev.ipv4_subnet_mask=255.255.255.0 -- /redis.conf" \
                -b kraft0 \
                -e ./redis_files \
                -m 100