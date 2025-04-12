// script.js

// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function () {
    // Seleciona o formulário
    const form = document.getElementById('cadastroForm');

    // Adiciona um listener para o evento de submit
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Impede o recarregamento da página

        // Obtém os dados do formulário
        const formData = new FormData(form);

        // Envia os dados para o endpoint /cadastrar
        fetch('/cadastrar', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message); // Exibe mensagem de sucesso ou erro
            if (data.message === "Cadastro realizado com sucesso!") {
                form.reset(); // Limpa os campos do formulário
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    });
});