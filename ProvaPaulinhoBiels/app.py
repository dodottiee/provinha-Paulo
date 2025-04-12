from flask import Flask, jsonify
from flask_cors import CORS
import random
import mysql.connector
import datetime

app = Flask(__name__)
CORS(app)

def create_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="123456",
        database="dados"
    )


def insert_sensor_data(data):
    conn = None
    cursor = None
    try:
        conn = create_connection()
        cursor = conn.cursor()
        query = "INSERT INTO sensores(umidade,presenca,temperatura,data) VALUES (%s,%s,%s,%s)"
        cursor.execute(query, (data['umidade'], data['presenca'], data['temperatura'], data['data']))
        conn.commit()
    except mysql.connector.Error as err:
        print(f"Erro no banco de dados: {err}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def get_sensor_data():
    now = datetime.datetime.now()
    data = {
        "data": now,
        "temperatura": round(random.uniform(20, 35), 2),
        "umidade": round(random.uniform(30, 90), 2),
        "presenca": random.choice([True, False])
    }

    insert_sensor_data(data)
    return data


@app.route('/sensores', methods=['GET'])
def sensores():
    return jsonify(get_sensor_data())

if __name__ == '__main__':
    app.run(debug=True)
