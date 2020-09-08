load('api_timer.js');
load('api_uart.js');
load('api_sys.js');
load('api_mqtt.js');
load('api_config.js');


let topic = Cfg.get("app.topic");
let qos = Cfg.get("app.qos");
let uartNo = 2;   // Uart number used for this example
let rxAcc = '';   // Accumulated Rx data, will be echoed back to Tx
let now = Timer.now();

// Configure UART at 115200 baud
UART.setConfig(uartNo, {
  baudRate: 9600,
  esp32: {
    gpio: {
      rx: 17,
      tx: 25,
    },
  },
});

// Set dispatcher callback, it will be called whenver new Rx data or space in
// the Tx buffer becomes available
UART.setDispatcher(uartNo, function(uartNo) {
  let ra = UART.readAvail(uartNo);
  if (ra > 0) {
    // Received new data: print it immediately to the console, and also
    // accumulate in the "rxAcc" variable which will be echoed back to UART later
    let data = UART.read(uartNo);
    print('Received UART data:', data);
    rxAcc += data;

    if (rxAcc.length === 9) {
      let ppm = rxAcc.charCodeAt(2) * 256 + rxAcc.charCodeAt(3);
      let ts = Timer.fmt("%FT%T%z", now);
      print(ts, ppm);

      //if(MQTT.isConnected()) {
        let payload = JSON.stringify({t:ts, co2ppm:ppm});
        print("payload", payload)
        MQTT.pub(topic, payload, qos, true)
      //}

    }
  }

}, null);

// Enable Rx
UART.setRxEnabled(uartNo, true);

// Send UART data every second
Timer.set(5000 /* milliseconds */, Timer.REPEAT, function() {
  now = Timer.now()
  UART.write(
    uartNo,
    '\xff\x01\x86\x00\x00\x00\x00\x00\x79'
  );
  rxAcc = '';
}, null);