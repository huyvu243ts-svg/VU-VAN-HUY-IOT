// Kết nối đến Broker HiveMQ
const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

// Khi kết nối thành công
client.on('connect', () => {
    console.log("Đã kết nối MQTT thành công!");

    // Đăng ký nhận dữ liệu từ ESP32
    client.subscribe('vuvanhuy/hethong/anhsang');
    client.subscribe('vuvanhuy/hethong/trangthai');
});

// Xử lý khi nhận dữ liệu từ ESP32
client.on('message', (topic, message) => {
    const payload = message.toString();
    console.log(`Nhận dữ liệu từ [${topic}]: ${payload}`);

    // Xử lý giá trị cảm biến ánh sáng
    if (topic === 'vuvanhuy/hethong/anhsang') {
        const lightValue = parseFloat(payload);

        const tempElement = document.getElementById('temp');
        if (tempElement) {
            tempElement.innerText = lightValue.toFixed(0) + " %";

            // Đổi màu theo trạng thái sáng/tối
            if (lightValue === 100) {
                tempElement.style.color = "#dfa500"; // Vàng - trời sáng
            } else {
                tempElement.style.color = "#555555"; // Xám - trời tối
            }
        }
    }

    // Xử lý trạng thái đèn
    if (topic === 'vuvanhuy/hethong/trangthai') {
        const statusElement = document.getElementById('status');

        if (statusElement) {
            statusElement.innerText = payload;

            if (payload === "ON") {
                statusElement.style.color = "#2ecc71"; // Xanh lá
            } else {
                statusElement.style.color = "#e74c3c"; // Đỏ
            }
        }
    }
});

// Nút bật đèn
document.getElementById('btnOn').onclick = () => {
    client.publish('vuvanhuy/hethong/dieukhien', '1');
    console.log("Đã gửi lệnh: BẬT ĐÈN");
};

// Nút tắt đèn
document.getElementById('btnOff').onclick = () => {
    client.publish('vuvanhuy/hethong/dieukhien', '0');
    console.log("Đã gửi lệnh: TẮT ĐÈN");
};