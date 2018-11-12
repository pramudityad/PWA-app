const URL="data/catatan.json";
fetch(URL)
 .then(response=> response.json())
 .then(rsp => {
 console.log(rsp.judul);
 console.log(rsp.lokasi)
 })
 .catch((err)=> console.log(err));