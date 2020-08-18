$(document).ready(function () {
    $("#submitskill").hover(function () {
        var skill = [];
        $("input:checkbox[name=prolanguage]:checked").each(function () {
            skill.push($(this).val());
        });
        $("#allskill").val(skill);
    })
});

$("#checkAll").click(function () {
    $('input:checkbox').not(this).prop('checked', this.checked);
    let style = '';
    if (this.checked == false) {
        style = 'display: none;';
    }
    $("#banAll").prop('style', style);
});


$(".tableUser").click(function () {
    let style = '';
    if (this.checked == false) {
        style = 'display: none;';
    }
    $("#banAll").prop('style', style);
});

$(document).ready(function () {
    $("#banAll").click(function () {
        var skill = [];
        $("input:checkbox[name=tableUser]:checked").each(function () {
            skill.push($(this).val());
        });
        $("#checkAllBannedUser").val(skill);
    })
});
$(document).ready(function () {
    $('#searchUser').keydown(function (event) {
        if (event.keyCode == 13) {
            searchUsers();
        }
    });
});