$(document).ready(() => {
    $('.add-to-cart').on('click', addToCart);
});

function addToCart() {
    var id = $(this).data('id');
    var quantity = 1;
    $.ajax({
        url: '/cart',
        type: 'POST',
        data: { id, quantity },
        success: function (result) {
            $('#cart-badge').html(result.totalQuantity);
        }
    });
}

function removeCartItem(id) {
    let itemID = 'item' + id;
    $.ajax({
        url: '/cart',
        type: 'DELETE',
        data: { id },
        success: function (result) {
            $('#cart-badge').html(result.totalQuantity);
            $('#totalPrice').html(result.totalPrice);
            $('#' + itemID).remove();
            itemlen = $('#cartsection').data('itemlen');
            itemlen = itemlen - 1;
            $('#cartsection').data('itemlen', itemlen);
            if (itemlen == 0) {
                $('#cart-badge').html('0');
                $('#cart-body').html('<div class = "alert alert-info text-center"> Giỏ hàng rỗng </div>')
            }
        }
    });
}

function clearCart() {
    if (confirm('Bạn thực sự muốn xóa tất cả khóa học?')) {
        $.ajax({
            url: '/cart/all',
            type: 'DELETE',
            success: function () {
                $('#cart-badge').html('0');
                $('#cart-body').html('<div class = "alert alert-info text-center"> Giỏ hàng rỗng </div>')
            }
        });
    }
}

function applyCoupon() {
    let voucherCode = $('#voucherCode').val();
    $.ajax({
        url: '/cart/voucher',
        type: 'POST',
        data: {
            voucherCode: voucherCode,
        },
        success: function (result) {
            if (result.status == 0) {
                $('#notiVoucher').html('<h5 style="color:red">Bạn hãy đăng nhập tài khoản</h5>');
            }
            else if (!result.voucher) {
                $('#notiVoucher').html('<h5 style="color:red">Mã không đúng hoặc đã hết hạn</h5>');
                $('#totalPrice').html('<h5 id="totalPrice">' + result.totalPrice + '</h5>')
            } else {
                $('#notiVoucher').html('<h5 style="color:green">Áp dụng mã giảm giá thành công</h5> <h5 style="color:green">Đã giảm giá ' + result.percentDiscount + '%</h5>');
                $('#totalPrice').html('<h5 class="money" id="totalPrice">' + result.totalPrice + '</h5>');
                $('#buttonCoupon').prop('disabled', true);
                $('#divVoucherCode').html('<input readonly class="form-control" type="text" id="voucherCode" name="voucherCode" value="' + voucherCode + '">');
                $('.xButton').prop('disabled', true);
                $.getScript("/js/simple.money.format.js", function () {
                    $('.money').simpleMoneyFormat();
                })
            }
        }
    })
}