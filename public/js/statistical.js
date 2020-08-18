let arr = ["2020", "2019", "2018"];
let value = [];
var show_statistical  = true;
for(let i=1; i<=3; i++){
  let revenue = document.getElementById(i).innerHTML;
  value.push(revenue);
}
new Chart(document.getElementById("myChartBar"), {
 type: 'bar',
    data: {
      labels: arr,
      datasets: [{
        backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f"],
        data: value
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Đồ thị dạng cột '
      }
    }
});

new Chart(document.getElementById("myChartPie"), {
    type: 'pie',
    data: {
      labels: arr,
      datasets: [{
        backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f"],
        data: value
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Đồ thị dạng tròn'
      }
    }
});


$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });