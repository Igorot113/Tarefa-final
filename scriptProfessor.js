document.addEventListener('DOMContentLoaded', () => {
    // 1. Pega o formulário pelo ID
    const formCadastro = document.getElementById('formCadastro');

    // Verifica se o formulário foi encontrado
    if (!formCadastro) {
        console.error("Erro: O formulário de cadastro não foi encontrado!");
        return;
    }

    // 2. Adiciona um 'ouvinte' de evento para quando o formulário for submetido
    formCadastro.addEventListener('submit', (evento) => {
        // Impede o envio padrão do formulário (que recarregaria a página)
        evento.preventDefault(); 
        
        // 3. Pega os valores dos campos
        const nome = document.getElementById('inputNome').value.trim();
        const cpf = document.getElementById('inputCpf').value.trim();
        const senha = document.getElementById('inputSenha').value;

        // Validação básica
        if (nome === "" || cpf === "" || senha === "") {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        // 4. Cria o objeto do novo professor
        // *************************************************************
        // ATENÇÃO: NUNCA SALVE SENHAS DIRETAMENTE! 
        // Em um projeto real, você criptografaria (hash) a senha antes de salvar. 
        // Para fins de estudo, vamos salvar o objeto.
        // *************************************************************
        const novoProfessor = {
            login: cpf, // O CPF será o login (chave única)
            nome: nome,
            senha: senha,
            tipo: 'professor'
        };

        // 5. Gerencia o 'Banco de Dados' no localStorage
        
        // Recupera a lista de professores (ou um array vazio se não existir)
        const professoresJSON = localStorage.getItem('professores');
        let professores = professoresJSON ? JSON.parse(professoresJSON) : [];

        // Verifica se o CPF já existe
        const cpfExiste = professores.some(prof => prof.login === novoProfessor.login);
        if (cpfExiste) {
            alert("Este CPF já está cadastrado como professor.");
            return;
        }

        // Adiciona o novo professor à lista
        professores.push(novoProfessor);

        // Salva a lista atualizada no localStorage (convertida para JSON string)
        localStorage.setItem('professores', JSON.stringify(professores));

        alert(`Cadastro de ${nome} (Professor) realizado com sucesso!`);
        
        // Opcional: Limpa o formulário e redireciona
        formCadastro.reset();
        window.location.href = 'index.html'; // Redireciona para a página de login
    });
});