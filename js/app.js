$(".phone_mask").mask("+7(999)999-99-99");  
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

   let tg = window.Telegram.WebApp;
    var buy = $("#buy");
    var order = $("#order");

    tg.expand();

    buy.click(function () {
        $("#main, #form").hide();
        $("#cocktails, #cart").show();
    });

    order.click(function () {
    $("#error").text('');
    let name = $("#user_name").val();
    let email = $("#user_email").val();
    let phone = $("#user_phone").val();
    let koment = $("#user_koment").val();
    let items = $("#cart-items").text();
    let total = $("#total").text();

    if (name.length < 5) {
        $("#error").text("Ошибка в имени");
        return;
    }
    if (email.length < 5) {
        $("#error").text("Ошибка в email");
        return;
    }
    if (phone.length < 5) {
        $("#error").text("Ошибка в номере телефона");
        return;
    }

    let data = {
        name: name,
        email: email,
        phone: phone,
        koment: koment,
        items: items,
        total: total
    }

    tg.sendData(JSON.stringify(data));
    tg.close();
});
});
