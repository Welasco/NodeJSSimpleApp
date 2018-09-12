#curl -d '{"MyKey":"My Value"}' -H "Content-Type: application/json" http://127.0.0.1:3000/
#curl -d '{"MyKey":"My Value"}' -H "Content-Type: application/json" http://127.0.0.1:3000/api/jsonpost -x 127.0.0.1:8888

# Avoiding SSL Warning for invalid certificate
##############################################
add-type @"
    using System.Net;
    using System.Security.Cryptography.X509Certificates;
    public class TrustAllCertsPolicy : ICertificatePolicy {
        public bool CheckValidationResult(
            ServicePoint srvPoint, X509Certificate certificate,
            WebRequest request, int certificateProblem) {
            return true;
        }
    }
"@
[System.Net.ServicePointManager]::CertificatePolicy = New-Object TrustAllCertsPolicy
##############################################

$JSON = @'
{"@type":"login",
"username":"xxx@gmail.com",
"password":"yyy"
}
'@

$response = Invoke-RestMethod -Uri "https://<FQDN or IP>/api/jsonpost" -Method Post -Body $JSON -ContentType "application/json" -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36"

# Test a Redirect in a website and specify a Host header entry.
Invoke-WebRequest -Uri http://64.25.21.216 -MaximumRedirection 0 -Headers @{Host= 'jetblue.com'}

# Force TLs 1.2
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-WebRequest -Uri http://64.25.21.216 -Headers @{Host= 'jetblue.com'}

# Using curl
curl --verbose http://jetblue.com --header 'Host: jetblue.com'