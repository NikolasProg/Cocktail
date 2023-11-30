$(document).ready(function () {
    var cartItems = [];
    var total = 0;

    function addToCart(itemName, itemPrice, itemVolume) {
        if (isNaN(itemPrice)) {
            console.error(`Неверное значение цены для товара: ${itemName}`);
            return;
        }

        var selectedVolume = itemVolume.trim();
        var additionalPrice = 0;

        if (selectedVolume.includes("+")) {
            additionalPrice += parseFloat(selectedVolume.split("+")[1]);
        }

        var existingItem = cartItems.find(item => item.name === itemName && item.volume === selectedVolume);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({ name: itemName, price: itemPrice, additionalPrice: additionalPrice, quantity: 1, volume: selectedVolume });
        }

        updateCart();
        updateTotal();
    }

    function updateCart() {
        var cartList = $("#cart-items");
        cartList.empty();

        cartItems.forEach(function (item) {
            if (isNaN(item.price)) {
                console.error(`Неверное значение цены для товара: ${item.name}`);
                return;
            }

            var itemTotal = (item.price + item.additionalPrice) * item.quantity;
            cartList.append("<li>" + item.name + " (" + item.volume + ") x" + item.quantity + " - " + itemTotal + "р</li>");
        });

        updateTotal();
    }

    function updateTotal() {
        total = 0;
        cartItems.forEach(function (item) {
            total += (item.price + item.additionalPrice) * item.quantity;
        });

        var totalElement = $("#total");
        if (!isNaN(total)) {
            totalElement.text("Итого: " + total.toFixed(2) + "р");
        } else {
            console.error("Неверное значение общей суммы корзины");
        }
    }

    $("#btn0").click(function () {
        var itemName = "Коктейль";
        var itemPrice = 180;
        var itemVolume = $("#user_obym").val();

        addToCart(itemName, itemPrice, itemVolume);
    });

    $(".btn").click(function () {
    var priceIndex = $(this).data("price-index");
    var itemName = $(this).text().trim().replace(/\s*\+.*$/, "");
    var itemPrice = parseFloat($(this).text().split(" ")[priceIndex]);
    var itemVolume = "";

    addToCart(itemName, itemPrice, itemVolume);
    });

	
    var clearCartButton = $("#clear-cart");
    clearCartButton.click(function () {
        cartItems = [];
        total = 0;
        updateCart();
        updateTotal();
    });

    var checkoutButton = $("#checkout");
    checkoutButton.click(function () {
        document.getElementById("main").style.display = "none";
		document.getElementById("cocktails").style.display = "none";
        document.getElementById("form").style.display = "block";
        fillUserData();
    });

    var buy = $("#buy");
    var order = $("#order");

    buy.click(function () {
        $("#main, #form").hide();
        $("#cocktails, #cart").show();
    });

    order.click(function () {
        $("#cocktails, #form").hide();
        fillUserData();

        $("#error").text('');
        var name = $("#user_name").val();
        var email = $("#user_email").val();
        var phone = $("#user_phone").val();
        var koment = $("#user_koment").val();

        if (name.length < 5 || email.length < 5 || phone.length < 5) {
            $("#error").text("Ошибка в одном из полей");
            return;
        }

        var data = {
            name: name,
            email: email,
            phone: phone,
            koment: koment,
            items: cartItems,
            total: total
        }

        tg.sendData(JSON.stringify(data));
        tg.close();
    });
});