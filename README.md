## Synthea UI

### System Requirements for Server

Synthea &trade; requires _Java JDK 11_ or newer. We **strongly** recommend using a **Long-Term Support (LTS)** release of Java, 11 or 17, as issues may occur with more recent non-LTS versions.

---

### Local Setup 

- Clone the Synthea &trade; github repo.
``` bash
git clone https://github.com/synthetichealth/synthea.git
cd synthea
./gradlew build check test
```

- Now Clone the _Synthea UI_ github repo.
``` bash
git clone https://github.com/udayfs/synthea-ui.git
cd synthea-ui
```

- The next two steps are crucial as they involves steps for configuring _Synthea UI_ server for generating output via the Synthea &trade; build we created in the first step.
``` bash
mv .env.example .env
```

- Now set the server port number and the synthea executable path in the .env file.
``` bash
VITE_SERVER_PORT=<PORTNUMBER>
SYNTHEA_EXECUTABLE_PATH="/path/to/run_synthea.sh OR \path\to\run_synthea.bat"
```

- Now install all the dependencies of _Synthea UI_.
``` bash
npm install
```

- Running the **Synthea UI** 
```bash
npm run start # after this go to http://localhost:5173 on your system's internet browser 
```

---

### Generated Output
The generated output will be automatically downloaded by the browser as it is received from the server. The download file will be a _.zip_ file which can be extracted to gather the real output.
