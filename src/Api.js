var url = "";
if (window.location.origin == "http://127.0.0.1:3000"){
    url = "http://127.0.0.1:8000"
}else if (window.location.origin == "https://paulduangithub.github.io"){
    url = "https://api.paulduan.tk/round-table"
}
export default url;