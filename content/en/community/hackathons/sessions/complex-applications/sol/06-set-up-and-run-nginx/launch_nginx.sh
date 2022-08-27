brctl addbr kraft0
ifconfig kraft0 172.44.0.1
ifconfig kraft0 up

dnsmasq -d \
        --log-queries \
        --bind-dynamic \
        --interface=kraft0 \
        --listen-addr=172.44.0.1 \
        --dhcp-range=172.44.0.2,172.44.0.254,255.255.255.0,12h &> $WORKDIR/dnsmasq.log &

./qemu_guest.sh -k ./build/nginx_kvm-x86_64 \
                -b kraft0 \
                -e ./nginx_files \
                -m 100 \
                -a ""