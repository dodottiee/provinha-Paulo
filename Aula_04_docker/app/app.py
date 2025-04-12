from flask import Flask, request, jsonify, render_template
import mysql.connector

# Cria uma instância do Flask
app = Flask(__name__)

# Configurações do banco de dados MySQL
db_config = {
    'host': 'db',           # Nome do serviço no docker-compose
    'user': 'root',         # Usuário do MySQL
    'password': 'password', # Senha do MySQL
    'database': 'cadastro_db' # Nome do banco de dados
}

# Rota principal: exibe o formulário
@app.route('/')
def index():
    return render_template('index.html')

# Rota para cadastrar usuários
@app.route('/cadastrar', methods=['POST'])
def cadastrar():
    # Obtém os dados do formulário
    data = request.json
    nome = data['nome']
    email = data['email']

    try:
        # Conecta ao banco de dados
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Insere os dados no banco de dados
        cursor.execute("INSERT INTO usuarios (nome, email) VALUES (%s, %s)", (nome, email))
        conn.commit()  # Confirma a transação

        # Fecha a conexão
        cursor.close()
        conn.close()

        # Retorna uma mensagem de sucesso
        return jsonify({"message": "Cadastro realizado com sucesso!"}), 200
    except Exception as e:
        # Retorna uma mensagem de erro
        return jsonify({"message": str(e)}), 500

# Rota para exibir os dados do banco de dados
@app.route('/usuarios')
def usuarios():
    try:
        # Conecta ao banco de dados
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        # Consulta todos os usuários
        cursor.execute("SELECT * FROM usuarios")
        usuarios = cursor.fetchall()  # Recupera todos os registros

        # Fecha a conexão
        cursor.close()
        conn.close()

        # Renderiza a página HTML com os dados
        return render_template('usuarios.html', usuarios=usuarios)
    except Exception as e:
        return f"Erro ao consultar o banco de dados: {str(e)}", 500

# Inicia o servidor Flask
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)