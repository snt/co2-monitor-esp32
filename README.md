# CO<sub>2</sub> monitor for ESP32 with Mongoose-OS

ESP32 with MH-Z19B dev Board to publish CO<sub>2</sub> concentration (ppm) to MQTT topic.

## Wiring

|MH-Z19B pin |ESP32 pin |
|------------|----------|
|V+          |5V        |
|V-          |GND       |
|TX          |GPIO17    |
|RX          |GPIO25    |


## Build

```bash
mos build  --platform esp32
```

## Write to ESP32

Connect your PC to ESP32 and

```
mos flash
```

## Setup WiFi

```
mos wifi $SSID $PASSWORD
```

## Confiration

Mongoose-OS does not support name resolving with mDNS, for now, so specify MQTT server address with IP address or DNS resolvable name.

```
mos config-set mqtt.enable=true mqtt.server=$YOUR_MQTT_SERER:1883 app.topic=/co2/2
```
