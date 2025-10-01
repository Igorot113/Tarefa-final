document.addEventListener('DOMContentLoaded', () => {
    const btnCadastroAluno = document.getElementById('btnCadastroAluno');

    btnCadastroAluno.addEventListener('click', () => {
        const nome = document.getElementById('nome').value;
        const cpf = document.getElementById('cpf').value;
        const senha = document.getElementById('senha').value;

        if (!nome || !cpf || !senha) {
            alert('Por favor, preencha todos os campos para cadastrar o aluno.');
            return;
        }
        const novoAluno = {
            nome: nome,
            cpf: cpf,
            senha: senha
        };

        const alunosExistentes = JSON.parse(localStorage.getItem('alunosCadastrados')) || [];

        alunosExistentes.push(novoAluno);

        localStorage.setItem('alunosCadastrados', JSON.stringify(alunosExistentes));

        alert(`Aluno(a) ${nome} cadastrado(a) com sucesso!`);

        //Limpa os campos após o cadastro
        document.getElementById('nome').value = '';
        document.getElementById('cpf').value = '';
        document.getElementById('senha').value = '';
        console.log('Lista de alunos atualizada:', alunosExistentes);
    });
});