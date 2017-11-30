# NodeJS Simple App
This is a NodeJS Sample WebApp for test porpuse.
The idea is to use it as small WebApp for Troubleshooting porpuse.
The WebApp will be listening in both HTTP and HTTPs.

# How to Use

Download and Install NodeJS.

Link: https://nodejs.org/en/download/

It works for Linux and Windows.

Install all dependencies just typing the following command from the project folder:

    npm install

To run the WebServer just type:

    node webjson.js

In case you don't need to use HTTPs please comment or remove the following lines in the webjson.js file:

    var sslOptions = {
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem'),
        passphrase: '1234'
      };
    var serverhttps = https.createServer(sslOptions,app);
    serverhttps.listen(443);

In case you need to use HTTPs you have to create a selfsigned certificate.

You can use OpenSSL for that. Here is the link to download OpenSSL for Windows:

https://slproweb.com/products/Win32OpenSSL.html

In case you are using OpenSSL for Windows don't forget to set this environment variable before run it:

    set OPENSSL_CONF=c:\OpenSSL-Win64\bin\openssl.cfg

Here is the command to create a Self-Signed certificate for NodeJS:

    openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365

Here is how the output will looks like:

    C:\OpenSSL-Win64\bin>openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
    Generating a 2048 bit RSA private key
    ...........................................................+++
    ...................................+++
    writing new private key to 'key.pem'
    Enter PEM pass phrase:
    Verifying - Enter PEM pass phrase:
    -----
    You are about to be asked to enter information that will be incorporated
    into your certificate request.
    What you are about to enter is what is called a Distinguished Name or a DN.
    There are quite a few fields but you can leave some blank
    For some fields there will be a default value,
    If you enter '.', the field will be left blank.
    -----
    Country Name (2 letter code) [AU]:US
    State or Province Name (full name) [Some-State]:TX
    Locality Name (eg, city) []:Irving
    Organization Name (eg, company) [Internet Widgits Pty Ltd]:ARR
    Organizational Unit Name (eg, section) []:Arr
    Common Name (e.g. server FQDN or YOUR name) []:webjson.arr.local
    Email Address []:a@a.com

After you have created the certificate don't forget to update the PassCode in webjson.js in this line:
	
    var sslOptions = {
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem'),
        passphrase: '1234'
      };

Now you can access the WebServer using http://localhost

In order to test a Json request you can use PowerShell or curl.

Here is a Powershell to test it:

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

Here is a curl command line:

    curl -d '{"MyKey":"My Value"}' -H "Content-Type: application/json" https://<FQDN or IP>/api/jsonpost -k -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36"

