from flask import Flask, render_template,request,jsonify

app = Flask(__name__)
ans = '0'

# This will be read by the ESP32
@app.route("/status")
def status():
    global ans
    response = ans
    ans = '0'  # Reset after reading
    return response

@app.route("/rotate/<int:n>")
def rot(n):
    print(n)
    global ans
    ans = str(n)
    return 'okay'


@app.route("/x", methods=["POST"])
def x():
    data = request.get_json()

    # Mapping item keys to labels
    item_map = {
        'item1': 'A',  # Cold Drink
        'item2': 'B',  # Chocolate Bar
        'item3': 'C'   # Chips
    }

    parts = []
    for item_key, label in item_map.items():
        quantity = data.get(item_key, 0)
        parts.append(f"{label}:{quantity}")

    rs = "_".join(parts)

    rot(rs)
    print("✅ Rotation command string:", ans)
    return jsonify({"status": "received", "ans": ans})


@app.route("/")
def web():
    return render_template('index.html')  # ✅ Corrected here

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
