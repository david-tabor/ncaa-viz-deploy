import os
import pandas as pd
import numpy as np
from flask import Flask, jsonify, render_template

app = Flask(__name__)

data = pd.read_csv('db/sample_data.csv')
time_data = pd.read_csv('db/top_25_rankings_by_week_v2.csv')


@app.route("/")
def index():
    """Return the homepage."""
    return render_template('index.html')

@app.route("/data")
def seasondata():
    """Return data."""
    return data.to_json ()

@app.route("/timedata")
def timedata():
    """Return data."""
    return time_data.to_json ()


@app.route("/timeseries")
def timeseries():
    """Return the homepage."""
    return render_template('timeseries.html')


if __name__ == "__main__":
    app.run()
