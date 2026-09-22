# TuneFault Selenium + TestNG tests

Start the backend on port 8000 and the frontend on `http://localhost:5173`, then run:

```powershell
cd C:\Users\babul\Desktop\TuneFault\Testing
mvn test
```

The suite uses headless Chrome by default. To watch it run:

```powershell
mvn test -Dheadless=false
```

TestNG reports are generated in `target\surefire-reports`.
