# importa as bibliotecas necessárias
from flask import Flask, jsonify
from flask_cors import CORS
import random  # Corrigido: Adicionando a importação de random
import mysql.connector #Biblioteca para conectar o banco de dados
from datetime import datetime

# cria a aplicação Flask
app = Flask(__name__)

# Habilita CORS para permitir que o frontend (JavaScript) faça requisições ao servidor Flask
CORS(app)

#Conexão com o banco de dados
def create_connection():
    return mysql.connector.connect(
      host="localhost", 
      user="root",
      password="123456",
      database="dados"


    )

# Função para simular os dados dos sensores
def get_sensor_data():
    data = {
        "temperatura": round(random.uniform(20, 150), 2),  # Gera valores aleatórios de temperatura entre 20°C e 80°C
        "umidade": round(random.uniform(30, 190), 2),      # Gera valores aleatórios de umidade entre 30% e 90%
        "pressao": round(random.uniform(900, 1100), 2),   # Gera valores aleatórios de pressão entre 900 hPa e 1100 hPa
        "agua": round(random.uniform(100, 500), 2),
        "gas": round(random.uniform(300, 900), 2)
        
    }

    #Inserir dados no banco
    insert_sensor_data(data)
    
    return data

DH = datetime.now()

#função para inserir dados no banco
def insert_sensor_data(data):
    try:
        conn = create_connection()
        cursor = conn.cursor()
        query = "INSERT INTO sensores(umidade,pressao,temperatura,agua,gas,dataHora) VALUE (%s,%s,%s,%s,%s,%s)"
        cursor.execute(query, (data['umidade'],data['pressao'],data['temperatura'],data['agua'],data['gas'],DH))
        conn.commit()
    except mysql.connector.Error as err:
        print(f"Error: (err)")
    finally:
        cursor.close()
        conn.close()


# Define a rota da API que responderá com os dados dos sensores em formato JSON
@app.route('/sensores', methods=['GET'])  # A rota '/sensores' responde apenas a requisições GET
def sensores():
    return jsonify(get_sensor_data())  # Retorna os dados simulados dos sensores em formato JSON

# Executa o servidor Flask apenas se este arquivo for executado
if __name__ == '__main__':  # Corrigido o erro de digitação
    app.run(debug=True)  # Inicia o servidor Flask em modo de depuração (debug=True) para facilitar o desenvolvimento