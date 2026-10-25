from datetime import datetime

from flask import Flask, render_template

app = Flask(__name__, static_folder="static")


@app.context_processor
def inject_current_year():
    return {"current_year": datetime.now().year}


@app.get("/")
def home():
    return render_template("index.html")


@app.get("/about")
def about():
    return render_template("about.html")


@app.get("/services")
def services():
    return render_template("services.html")


@app.get("/contacts")
def contacts():
    return render_template("contacts.html")


if __name__ == "__main__":
    app.run(debug=True)
