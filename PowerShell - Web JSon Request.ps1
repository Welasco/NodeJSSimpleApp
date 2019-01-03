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


# test Alexa
curl -H "Content-Type: application/json" -H "SignatureCertChainUrl: https://s3.amazonaws.com/echo.api/echo-api-cert-2.pem" -H "Signature: OMEN68E8S0H9vTHRBVQMmWxeXLV8hpQoodoU6NdLAUB12BjGVvOAgCq7LffPDKCW7zXI6wRc3dx0pklYWqZHXbNsMfx8xSN3lqJTYw6zLZGwt2MgcjajHa1AnMbTnZOjrq9WPZuFG0pyJj9ucKB0w/k4r123vOLzVI0pEISo3WTIDsfKMycIpGiNcDHdJIc2LQGG5Bum9TFJuUllpt5c5LQC9g1rKIS2nj55QCQ8a3EeeqDe3N85Sw6OT7k7oPkKVLPee5fAWfkQQqW1fmA7sGIWKDpVTi1Jq46I2MiJM+48m+rxOVEPXky3j8u8+lPWg6vOnKogoXTb52foAurmAA==" -X POST -d {\"version\":\"1.0\",\"session\":{\"new\":true,\"sessionId\":\"amzn1.echo-api.session\",\"application\":{\"applicationId\":\"amzn1.echo-sdk-ams.app\"},\"user\":{\"userId\":\"amzn1.account\",\"accessToken\":\"token\"}},\"request\":{\"type\":\"LaunchRequest\",\"requestId\":\"amzn1.echo-api.request\",\"timestamp\":\"2015-10-07T16:48:23Z\"}} --verbose https://api.hepoca.com/api/television

####################### Start code to avoid Self Signed certificates errors ##########################################
## Choose to ignore any SSL Warning issues caused by Self Signed Certificates    
## Code From http://poshcode.org/624  
## Create a compilation environment  
$Provider=New-Object Microsoft.CSharp.CSharpCodeProvider  
$Compiler=$Provider.CreateCompiler()  
$Params=New-Object System.CodeDom.Compiler.CompilerParameters  
$Params.GenerateExecutable=$False  
$Params.GenerateInMemory=$True  
$Params.IncludeDebugInformation=$False  
$Params.ReferencedAssemblies.Add("System.DLL") | Out-Null  
$TASource=@' 
  namespace Local.ToolkitExtensions.Net.CertificatePolicy{ 
    public class TrustAll : System.Net.ICertificatePolicy { 
      public TrustAll() {  
      } 
      public bool CheckValidationResult(System.Net.ServicePoint sp, 
        System.Security.Cryptography.X509Certificates.X509Certificate cert,  
        System.Net.WebRequest req, int problem) { 
        return true; 
      } 
    } 
  } 
'@
$TAResults=$Provider.CompileAssemblyFromSource($Params,$TASource)  
$TAAssembly=$TAResults.CompiledAssembly  
## We now create an instance of the TrustAll and attach it to the ServicePointManager  
$TrustAll=$TAAssembly.CreateInstance("Local.ToolkitExtensions.Net.CertificatePolicy.TrustAll")  
[System.Net.ServicePointManager]::CertificatePolicy=$TrustAll  
## end code from http://poshcode.org/624  
####################### End the code to avoid Self Signed certificates errors ##########################################

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$Header =  @{
'Host'= 'www.lawyersirsresolutionservice.com'
}


$JSON = @'
{
  "version": "1.0",
  "session": {
    "new": false,
    "sessionId": "amzn1.echo-api.session.0000000-0000-0000-0000-00000000000",
    "application": {
      "applicationId": "amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe"
    },
    "attributes": {
      "supportedHoroscopePeriods": {
        "daily": true,
        "weekly": false,
        "monthly": false
      }
    },
    "user": {
      "userId": "amzn1.account.AM3B00000000000000000000000"
    }
  },
  "context": {
    "System": {
      "application": {
        "applicationId": "amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe"
      },
      "user": {
        "userId": "amzn1.account.AM3B00000000000000000000000"
      },
      "device": {
        "supportedInterfaces": {
          "AudioPlayer": {}
        }
      }
    },
    "AudioPlayer": {
      "offsetInMilliseconds": 0,
      "playerActivity": "IDLE"
    }
  },
  "request": {
    "type": "IntentRequest",
    "requestId": " amzn1.echo-api.request.0000000-0000-0000-0000-00000000000",
    "timestamp": "2015-05-13T12:34:56Z",
    "dialogState": "COMPLETED",
    "locale": "string",
    "intent": {
      "name": "GetZodiacHoroscopeIntent",
      "confirmationStatus": "NONE",
      "slots": {
        "ZodiacSign": {
          "name": "ZodiacSign",
          "value": "virgo",
          "confirmationStatus": "NONE"
        }
      }
    }
  }
}
'@


Invoke-RestMethod -Uri "https://api.hepoca.com/api/television" -Method Post -Body $JSON -ContentType "application/json"