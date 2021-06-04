function msgDiv() {
    if ((window.location.href.split("?", 2)[1]) === "confirm") {
      setTimeout(function () { document.getElementById("confirmation").style.display = "block"; }, 500);
      setTimeout(function () { $(".show-msg").addClass("active"); }, 5000);      
      setTimeout(function () { document.getElementById("confirmation").style.display = "none"; }, 6000);
    }
}
msgDiv();