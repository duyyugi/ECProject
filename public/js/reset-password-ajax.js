function checkAndSendEmail() {
    let emailResetPassword = $('#emailResetPassword').val();
    $.ajax({
        url: '/user/check-and-send-email',
        method: 'POST',
        data: {
            emailResetPassword: emailResetPassword
        },
        success: function (result) {
            if (result.checkEmail) {
                $('#emailNotMatch').html('');
                $('#emailResetPassword').prop("disabled", true);
                $('#emailSent').html('<label class="col-sm-12 control-label" style="color: green">Email đã được gửi, vui lòng nhập mã OTP có trong email để đặt lại mật khẩu</label>');
                $('#OTPdiv').removeAttr("hidden");
                $('#sendEmail').prop("disabled", true);
                $('#newResetPassword1div').removeAttr("hidden");
                $('#newResetPassword2div').removeAttr("hidden");
                $('#tOtpCode').val(result.otpCode);
                $('#userID').val(result.userID);
            } else {
                $('#emailNotMatch').html('<label class="col-sm-12 control-label" style="color: blue">Email nhập vào không khớp với bất cứ tài khoản nào</label>');
            }
        }
    })
}

function resetPassword() {
    let otpCode = $('#otpCode').val();
    let tOtpCode = $('#tOtpCode').val();
    let userID = $('#userID').val();
    let newResetPassword1 = $('#newResetPassword1').val();
    let newResetPassword2 = $('#newResetPassword2').val();

    $.ajax({
        url: '/user/forget-password',
        method: 'POST',
        data: {
            otpCode: otpCode,
            tOtpCode: tOtpCode,
            userID: userID,
            newResetPassword1: newResetPassword1,
            newResetPassword2: newResetPassword2
        },
        success: function (result) {
            if (!result.checkOtp) {
                $('#otpFalse').html('<label class="col-sm-12 control-label" style="color: red">Mã OTP nhập vào không đúng, vui lòng kiểm tra lại</label>');
            } else {
                $('#otpFalse').html('');
                if (!result.checkMatchedPassword) {
                    $('#newPasswordNotMatch').html('<label class="col-sm-12 control-label" style="color: blue">Mật khẩu không khớp, vui lòng nhập lại</label>')
                } else {
                    $('#otpFalse').html('');
                    $('#newPasswordNotMatch').html('');
                    $('#changePasswordDone').html('<label class="col-sm-12 control-label" style="color: green">Thay đổi mật khẩu thành công</label>')
                    $('#otpCode').prop("disabled", true);
                    $('#newResetPassword1').prop("disabled", true);
                    $('#newResetPassword2').prop("disabled", true);
                }
            }
        }
    })
}