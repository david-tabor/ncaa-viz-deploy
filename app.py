import os
import pandas as pd
import numpy as np
from flask import Flask, jsonify, render_template

app = Flask(__name__)

data = pd.read_csv('db/sample_data.csv')


@app.route("/")
def index():
    """Return the homepage."""
    return render_template('index.html')

@app.route("/data")
def names():
    """Return data."""

    # Return a list of the column names (sample names)
    return data.to_json()

if __name__ == "__main__":
    app.run()
