document.addEventListener('DOMContentLoaded', () => {
    /**
     * Verifica se a string contém APENAS letras (incluindo acentos) e espaços.
     */
    function validarNome(str) {
        // Regex que permite A-Z, a-z, caracteres acentuados comuns em português e espaços (\s)
        const regexNome = /^[A-Za-záàâãéèêíìîóòôõúùûüçÇ\s]+$/;
        return regexNome.test(str);
    }
    
    /**
     * Verifica se a senha é forte:
     * - Mínimo de 8 caracteres
     * - Contém pelo menos 1 caractere especial (!@#$%^&*(),.?)
     */
    function validarSenhaForte(senha) {
        // Regex para verificar se contém pelo menos 1 caractere especial
        const regexEspecial = /[!@#$%^&*(),.?":{}|<>]/;
        
        if (senha.length < 8) {
            return false;
        }
        
        if (!regexEspecial.test(senha)) {
            return false;
        }

        return true;
    }

    const formCadastro = document.getElementById('formCadastro');
    const inputNome = document.getElementById('inputNome');
    
    if (!formCadastro) {
        console.error("Erro: O formulário de cadastro não foi encontrado!");
        return;
    }

    if (inputNome) {
        inputNome.addEventListener('keypress', (e) => {
            const charCode = (e.which) ? e.which : e.keyCode;
            if (charCode >= 48 && charCode <= 57) {
                e.preventDefault();
            }
        });
    }

    formCadastro.addEventListener('submit', (evento) => {
        evento.preventDefault(); 
        
        const nome = document.getElementById('inputNome').value.trim();
        const cpf = document.getElementById('inputCpf').value.trim();
        const senha = document.getElementById('inputSenha').value;

        // VALIDAÇÃO DE NOME
        if (!validarNome(nome)) {
            alert('O campo Nome só pode conter letras e espaços. Números e caracteres especiais não são permitidos.');
            document.getElementById('inputNome').focus();
            return;
        }

        // VALIDAÇÃO DE SENHA FORTE (8 caracteres e 1 especial)
        if (!validarSenhaForte(senha)) {
            alert("A senha é fraca. Ela deve conter pelo menos 8 caracteres e incluir no mínimo 1 caractere especial (ex: !@#$%&*).");
            document.getElementById('inputSenha').focus();
            return; 
        }

        // VALIDAÇÃO BÁSICA DE CAMPOS VAZIOS
        if (nome === "" || cpf === "" || senha === "") {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        const novoProfessor = {
            login: cpf, 
            nome: nome,
            senha: senha,
            tipo: 'professor'
        };

        // CHECAGEM DE CPF DUPLICADO
        const professoresJSON = localStorage.getItem('professores');
        let professores = professoresJSON ? JSON.parse(professoresJSON) : [];

        const cpfExiste = professores.some(prof => prof.login === novoProfessor.login);
        
        if (cpfExiste) {
            alert("Este CPF já está cadastrado como professor.");
            return;
        }

        professores.push(novoProfessor);
        localStorage.setItem('professores', JSON.stringify(professores));

        alert(`Cadastro de ${nome} (Professor) realizado com sucesso!`);
        
        formCadastro.reset();
        window.location.href = 'index.html'; 
    });
});