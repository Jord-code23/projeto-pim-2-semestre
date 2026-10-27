BarberTechApi - Backend

📋 Descrição do Projeto

A BarberTechApi é a API de backend desenvolvida em C# para o ecossistema BarberTech, projetada para gerenciar operações essenciais de barbearias, incluindo autenticação segura via JWT, gerenciamento de clientes, barbeiros, serviços e agendamentos inteligentes com prevenção de conflitos.

🛠️ Tecnologias Utilizadas

Linguagem: C# (.NET 8 / ASP.NET Core Web API)

Banco de Dados: MySQL

ORM: Entity Framework Core

Segurança: Autenticação e Autorização baseada em Tokens JWT ([Authorize])

Governança & Gestão de Serviços: ITIL v4 (Alinhamento de valor, melhoria contínua e controle de mudanças)

⚙️ Regras de Negócio Implementadas

Validação de Conflito de Horários (Overlapping Check):

Impede o agendamento de horários sobrepostos para o mesmo barbeiro, calculando automaticamente a duração exata de cada serviço.

Antecedência Mínima para Cancelamento:

O cliente só pode cancelar agendamentos com no mínimo 2 horas de antecedência em relação ao horário marcado.

Segurança por Identidade (JWT):

Rotas sensíveis exigem token válido; os IDs dos usuários são extraídos diretamente das claims do token, impedindo ações não autorizadas em nome de terceiros.

👥 Guia de Fluxo de Trabalho e Governança (Git & ITIL v4)

Para garantir a estabilidade do ambiente de produção e a entrega contínua de valor (conforme as diretrizes do ITIL v4), adotamos um fluxo rigoroso de controle de mudanças através de Branches e Pull Requests.

1. Nomenclatura de Branches

feature/nome-da-funcionalidade (Para novas implementações)

fix/nome-do-problema (Para correção de bugs)

refactor/nome-do-componente (Para melhorias de código sem alterar regras externas)

2. Ciclo de Vida da Mudança (Branch & PR Workflow)

Desenvolvimento Local: Nenhuma alteração direta é feita na branch main. Crie sua branch a partir da main atualizada:

git checkout main
git pull
git checkout -b feature/sua-feature


Commit Semântico: Faça commits claros e descritivos:

git add .
git commit -m "feat: adiciona regra de validação de conflitos"


Envio para o Repositório Remoto:

git push -u origin feature/sua-feature


Abertura do Pull Request (PR):

Abra um PR no GitHub direcionando para a branch main.

Preencha a descrição informando o que foi alterado e o motivo da mudança (gestão de mudanças ITIL).

3. Diretrizes de Revisão de Código (Code Review)

Aprovações Obrigatórias: Todo PR exige no mínimo 1 aprovação de outro membro da equipe (líder ou co-desenvolvedor) antes de poder sofrer o merge.

Resolução de Conversas: Todos os comentários, dúvidas ou apontamentos deixados no código durante a revisão devem ser resolvidos e respondidos.

Atualização de Versão: Se novos commits forem enviados à branch após a aprovação, as aprovações anteriores serão automaticamente invalidadas para garantir uma nova checagem de segurança.

Proibido Push Forçado: O uso de git push --force na branch main está estritamente bloqueado por políticas de segurança do repositório.
