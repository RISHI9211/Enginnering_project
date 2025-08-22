window.goToPayment = function () {
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const totalPrice = parseFloat(document.getElementById('total-price').textContent) * 100;
    const item1 = parseFloat(document.getElementById('item1').value);
    const item2 = parseFloat(document.getElementById('item2').value);
    const item3 = parseFloat(document.getElementById('item3').value);

    const selectedItems = [];
    document.querySelectorAll('.product-checkbox:checked').forEach(checkbox => {
        selectedItems.push(checkbox.value);
    });

    if (totalPrice === 0) {
        alert("Please select at least one product.");
        return;
    }

    if (!name || !/^\d{10}$/.test(phone)) {
        alert("Please enter a valid name and 10-digit phone number.");
        return;
    }

    const options = {
        key: "rzp_test_p7oleGr9Xev6y9", // Razorpay test/live key
        amount: totalPrice,
        currency: "INR",
        name: "Vending Machine",
        description: "Payment for selected products",
        prefill: {
            name: name,
            contact: phone,
        },
        theme: {
            color: "#007bff",
        },
        handler: function (response) {
            const data = {
                name: name,
                phone: phone,
                item1:item1,
                item2:item2,
                item3:item3, 
                quantity: 1,
                payment_id: response.razorpay_payment_id,
                timestamp: Date.now()
            };

            console.log("✅ Sending to Flask /x:", data);
            // alert(`✅ sending data`); 
            fetch("/x", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(res => {
                
                if (!res.ok) throw new Error("Failed to send to Flask");
                return res.json();
            })
            .then(result => {
                alert(`✅ response`,result);
                console.log("✅ Flask response:", result);
                alert(`✅ Payment successful! Transaction ID: ${response.razorpay_payment_id}`);
            })
            .catch(err => {
                console.error("❌ Error sending data to Flask:", err);
                alert(`❌ Payment done, but failed to send data to server.\nTransaction ID: ${response.razorpay_payment_id}`);
            });
        },
        modal: {
            ondismiss: function () {
                console.log("Payment window closed");
            }
        }
    };

    const rzp = new Razorpay(options);
    rzp.open();
};
