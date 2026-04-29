# Relatorio de Integracao Front-end x Back-end

Este documento explica como o back-end do `equipment-control-api` esta estruturado e o que o front-end ainda precisa implementar para usar o sistema de forma completa.

## Objetivo

O back-end ja possui uma base funcional para autenticacao, producao, manutencao, tipos de equipamento, inspecao de montagem, historico de alteracoes e exclusao logica. O front-end ainda utiliza apenas parte desses recursos. A prioridade agora e alinhar as telas do front aos contratos reais da API, evitando dados mockados e evitando fluxos que parecam existir mas nao persistem no banco.

## Base da API

Em desenvolvimento local:

```text
http://localhost:3000
```

Documentacao Swagger:

```text
http://localhost:3000/docs
```

Autenticacao:

```http
Authorization: Bearer <access_token>
```

O token vem de `POST /auth/login`.

## Autenticacao

### Endpoints

```http
POST /auth/register
POST /auth/login
GET /auth/me
```

### Login

Payload:

```json
{
  "email": "dev.local@example.com",
  "senha": "123456"
}
```

Resposta:

```json
{
  "access_token": "jwt",
  "usuario": {
    "id": "uuid",
    "nome": "Dev Local",
    "email": "dev.local@example.com",
    "ativo": true,
    "precisaTrocarSenha": true
  }
}
```

### O que o front precisa garantir

- Usar `/auth/login`, nao `/login`.
- Enviar `senha`, nao `password`.
- Guardar `access_token`.
- Enviar `Authorization: Bearer <token>` em todas as rotas protegidas.
- Tratar `401` limpando sessao e redirecionando para `/login`.
- Usar `/auth/me` para validar usuario logado, se necessario.

## Producao

### Modelo principal

No banco, producao e representada por `Equipment` (Producao).

Campos importantes:

- `id`             
- `numeroOrdem`: gerado automaticamente pelo banco.
- `numeroSerie`: gerado pelo backend como `modelo-numeroOrdem`.
- `tag`: unica, cadastrada apenas quando a producao estiver concluida.
- `dataSolicitacao`
- `solicitante`
- `dataInicio`
- `dataTermino`
- `statusProducao`: `PROGRAMADA`, `EM_ANDAMENTO`, `CONCLUIDA`
- `tipoEquipamentoId`
- `modelo`
- `descricao`
- flags booleanas:
  - `listaPecas`
  - `sequenciaMontagem`
  - `inspecaoMontagem`
  - `historicoEquipamento`
  - `procedimentoTesteInspecaoMontagem`
- `itensSeriados`
- `observacoes`
- `registrosInspecaoMontagem`
- `historicoAlteracoes`
- `ativo`
- `excluidoEm`

### Endpoints

```http
POST /producoes
GET /producoes
GET /producoes/:id
GET /producoes/ordem/:numeroOrdem
PUT /producoes/:id
DELETE /producoes/:id
POST /producoes/:id/observacoes
GET /producoes/:id/observacoes
PATCH /producoes/:id/tag
GET /producoes/:id/inspecao-montagem
PATCH /producoes/:id/inspecao-montagem/:ordem
GET /producoes/:id/historico
```

Todas essas rotas usam JWT.

### Criar producao

Payload esperado:

```json
{
  "dataSolicitacao": "2026-04-29",
  "solicitante": "Joao Junior",
  "dataInicio": "2026-04-29",
  "dataTermino": "2026-05-02",
  "statusProducao": "PROGRAMADA",
  "tipoEquipamentoId": "uuid-do-tipo",
  "modelo": "CSEX420ACM",
  "descricaoComplemento": "Exaustor 420 monofasico",
  "listaPecas": true,
  "sequenciaMontagem": true,
  "inspecaoMontagem": true,
  "historicoEquipamento": true,
  "procedimentoTesteInspecaoMontagem": true,
  "itensSeriados": [
    {
      "descricao": "Motor W22Xdb carcaca 80"
    }
  ]
}
```

Observacoes:

- O front nao deve enviar `numeroOrdem`; ele e autoincremental.
- O front nao deve montar `numeroSerie`; o backend monta.
- Os documentos sao flags booleanas, nao texto livre.
- `descricaoComplemento` e usado para montar a descricao junto com o tipo de equipamento.

### Listar producoes

Query params disponiveis:

```text
page
limit
numeroOrdem
numeroSerie
modelo
tag
statusProducao
tipoEquipamentoId
sortBy
sortOrder
```

`sortBy` aceita:

```text
criadoEm
dataSolicitacao
dataInicio
dataTermino
numeroOrdem
modelo
statusProducao
```

Resposta:

```json
{
  "data": [],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

### Contagens e indicadores para o front

O backend ainda nao tem um endpoint especifico de dashboard, mas o front ja consegue montar contagens usando `GET /producoes?limit=...`:

- total de producoes
- producoes por status
- producoes em andamento
- producoes concluidas
- producoes programadas
- producoes sem TAG
- producoes com inspecao preenchida

Se isso ficar pesado, criar depois um endpoint de resumo no back:

```http
GET /producoes/resumo
```

### Dias de producao

O backend calcula:

- `diasSolicitacao`: entre `dataSolicitacao` e `dataInicio`.
- `diasProducao`: calculado quando `statusProducao` e `EM_ANDAMENTO`, usando `dataInicio` ate `dataTermino` ou data atual.

O front deve exibir esses campos quando vierem na resposta, sem recalcular de forma diferente.

### Edicao de producao

Endpoint:

```http
PUT /producoes/:id
```

Usa os mesmos campos de criacao, todos opcionais.

Importante:

- Quando uma producao e alterada, o backend registra automaticamente historico em `HistoricoProducao`.
- O front deve usar esse historico para tela de auditoria/historico do equipamento.

### Observacoes

Endpoints:

```http
POST /producoes/:id/observacoes
GET /producoes/:id/observacoes
```

Payload:

```json
{
  "descricao": "Atrasou por falta de pecas"
}
```

O front precisa tratar observacoes como lista separada, nao como um campo unico de texto dentro da producao.

### TAG

Endpoint:

```http
PATCH /producoes/:id/tag
```

Payload:

```json
{
  "tag": "TAG-0001"
}
```

Regra de negocio:

- So pode cadastrar TAG quando `statusProducao` for `CONCLUIDA`.
- TAG deve ser unica.

O front deve:

- Mostrar botao/campo de TAG apenas quando a producao estiver concluida.
- Tratar erro de conflito quando TAG ja existir.

### Delete logico

Endpoint:

```http
DELETE /producoes/:id
```

O registro nao e apagado fisicamente. O backend marca:

- `ativo = false`
- `excluidoEm = data atual`

As listagens padrao retornam apenas registros ativos.

O front precisa:

- Ter acao de excluir/inativar.
- Atualizar lista depois da exclusao.
- Idealmente confirmar antes.

## Inspecao de Montagem

### Como funciona no back-end

Ao criar uma producao, o backend cria automaticamente 16 registros vazios em `RegistroInspecaoMontagem`.

Campos de cada registro:

- `id`
- `equipmentId`
- `ordem`
- `valorObservado`
- `instrumentoMedicao`
- `conformidades`: booleano
- `criadoEm`
- `atualizadoEm`

### Endpoints

```http
GET /producoes/:id/inspecao-montagem
PATCH /producoes/:id/inspecao-montagem/:ordem
```

Payload de atualizacao:

```json
{
  "valorObservado": "420mm",
  "instrumentoMedicao": "Paquimetro",
  "conformidades": true
}
```

### O que o front precisa fazer

- A tela de inspecao deve partir de uma producao existente.
- Nao deve criar uma inspecao solta sem producao.
- Deve buscar os 16 registros reais por `GET /producoes/:id/inspecao-montagem`.
- Deve salvar item por item ou salvar em lote disparando os 16 `PATCH`.
- Deve mapear `conformidades`:
  - `true` = conforme / SIM
  - `false` = nao conforme / NAO
  - `null` = pendente

### Gap atual

O formulario antigo do front tinha mais itens do que o backend persiste hoje. O backend atual persiste 16 registros. Se o formulario oficial precisa de mais itens, ha duas opcoes:

1. Ajustar o front para trabalhar apenas com os 16 itens atuais.
2. Expandir o schema/backend para persistir todos os itens do formulario completo.

## Historico do Equipamento / Historico de Producao

### Como funciona no back-end

O backend gera historico automaticamente quando `PUT /producoes/:id` altera campos monitorados.

Modelo: `HistoricoProducao`.

Campos:

- `id`
- `equipmentId`
- `campo`
- `valorAnterior`
- `valorNovo`
- `alteradoPor`
- `criadoEm`

### Endpoint

```http
GET /producoes/:id/historico
```

Tambem vem incluido na listagem `GET /producoes` como `historicoAlteracoes`.

### O que o front precisa fazer

- Nao criar historico manualmente, porque hoje o backend nao tem endpoint para isso.
- Mostrar historico como auditoria de alteracoes.
- Para gerar historico, o usuario deve editar a producao.
- A tela deve exibir:
  - data
  - campo alterado
  - valor anterior
  - valor novo
  - alterado por

### Gap atual

O front antigo tinha uma ideia de "Novo Historico" manual, com registros livres. Isso nao existe no backend atual. Se essa funcionalidade for requisito de negocio, precisa criar endpoint/modelo especifico para registros manuais de historico do equipamento. Caso contrario, a tela deve ser somente leitura.

## Manutencao

### Modelo principal

No banco: `Manutencao`.

Campos importantes:

- `id`
- `origem`: `SYNCHRO` ou `MANUAL`
- `tipoEquipamentoNome`
- `modeloEquipamento`
- `numeroSerie`
- `tag`
- `situacaoEquipamento`
- `dataRetornoBase`
- `dataInicio`
- `dataTermino`
- `statusManutencao`: `PENDENTE`, `EM_MANUTENCAO`, `CONCLUIDA`
- `diagnostico`
- `responsavelManutencao`
- `criadoEm`
- `atualizadoEm`
- `ativo`
- `excluidoEm`
- `historicoAlteracoes`

### Endpoints

```http
POST /manutencoes/synchro
POST /manutencoes
GET /manutencoes
GET /manutencoes/:id
GET /manutencoes/:id/historico
PATCH /manutencoes/:id
DELETE /manutencoes/:id
```

Observacao:

- `POST /manutencoes/synchro` usa `x-integration-key`.
- As demais rotas principais usam JWT.

### Criacao via Synchro

Endpoint:

```http
POST /manutencoes/synchro
```

Headers:

```http
x-integration-key: chave
```

Payload:

```json
{
  "tipoEquipamentoNome": "Exaustor",
  "modeloEquipamento": "Exaustor 420 Monofasico",
  "numeroSerie": "CSEX420ACM-0559",
  "tag": "TAG-0001",
  "situacaoEquipamento": "Retornou para a base",
  "dataRetornoBase": "2026-04-29"
}
```

Regra:

- So cria manutencao se `situacaoEquipamento` indicar retorno para base.
- Bloqueia duplicidade se ja existir manutencao aberta para mesma serie ou TAG com status `PENDENTE` ou `EM_MANUTENCAO`.
- Cria com `statusManutencao = PENDENTE`.

### Criacao manual

Endpoint:

```http
POST /manutencoes
```

Payload:

```json
{
  "tipoEquipamentoNome": "Exaustor",
  "modeloEquipamento": "Exaustor 420 Monofasico",
  "numeroSerie": "CSEX420ACM-0559",
  "tag": "TAG-0001",
  "situacaoEquipamento": "Manutencao manual",
  "dataRetornoBase": "2026-04-29",
  "dataInicio": "2026-04-29",
  "diagnostico": "Diagnostico inicial",
  "responsavelManutencao": "Joao da Silva",
  "statusManutencao": "EM_MANUTENCAO"
}
```

### Listagem com filtros

Endpoint:

```http
GET /manutencoes
```

Query params:

```text
statusManutencao
tag
numeroSerie
tipoEquipamentoNome
modeloEquipamento
page
limit
sortBy
sortOrder
```

`sortBy` aceita:

```text
criadoEm
dataRetornoBase
dataInicio
dataTermino
statusManutencao
```

Resposta:

```json
{
  "data": [],
  "total": 10,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### Dias de manutencao

O backend adiciona `diasManutencao` quando `statusManutencao` e `EM_MANUTENCAO`.

Calculo:

- usa `dataInicio`
- ate `dataTermino`, se existir
- senao ate data atual
- minimo de 1 dia

O front deve exibir esse campo nas telas/listagens.

### Edicao de manutencao

Endpoint:

```http
PATCH /manutencoes/:id
```

Payload:

```json
{
  "diagnostico": "Troca de rolamento e revisao completa",
  "responsavelManutencao": "Joao da Silva",
  "statusManutencao": "EM_MANUTENCAO",
  "dataInicio": "2026-04-29",
  "dataTermino": "2026-05-01"
}
```

Regras:

- Ao editar, o backend registra historico em `HistoricoManutencao`.
- Campos monitorados:
  - `diagnostico`
  - `responsavelManutencao`
  - `statusManutencao`
  - `dataInicio`
  - `dataTermino`

### Historico de manutencao

Endpoint:

```http
GET /manutencoes/:id/historico
```

Deve ser exibido como auditoria:

- campo alterado
- valor anterior
- valor novo
- alterado por
- data

### Delete logico

Endpoint:

```http
DELETE /manutencoes/:id
```

Marca:

- `ativo = false`
- `excluidoEm = data atual`

### O que falta no front de manutencao

- Tela de editar manutencao.
- Acao para alterar status:
  - `PENDENTE`
  - `EM_MANUTENCAO`
  - `CONCLUIDA`
- Campos de `diagnostico`, `responsavelManutencao`, `dataInicio`, `dataTermino`.
- Exibir `diasManutencao`.
- Filtros por status, TAG, numero de serie, tipo e modelo.
- Paginacao.
- Ordenacao.
- Visualizacao de historico da manutencao.
- Excluir/inativar manutencao.
- Indicadores/contagens:
  - total
  - pendentes
  - em manutencao
  - concluidas
  - manutencoes abertas por mais de X dias

## Tipos de Equipamento

### Endpoints

```http
POST /tipos-equipamento
GET /tipos-equipamento
GET /tipos-equipamento/:id
PUT /tipos-equipamento/:id
PATCH /tipos-equipamento/:id/inativar
PATCH /tipos-equipamento/:id/ativar
```

Todas as rotas usam JWT.

### Modelo

Campos:

- `id`
- `nome`
- `ativo`
- `criadoEm`
- `atualizadoEm`

### O que o front precisa fazer

- Criar tela ou modal para cadastro de tipos.
- Usar `GET /tipos-equipamento` nos formularios de producao.
- Enviar `tipoEquipamentoId` ao criar/editar producao.
- Permitir editar nome.
- Permitir ativar/inativar.
- Filtrar visualmente tipos inativos quando necessario.

## Status e Fluxos Recomendados

### Producao

Status:

```text
PROGRAMADA
EM_ANDAMENTO
CONCLUIDA
```

Fluxo sugerido:

1. Criar producao como `PROGRAMADA`.
2. Ao iniciar producao, preencher `dataInicio` e mudar para `EM_ANDAMENTO`.
3. Ao finalizar, preencher `dataTermino` e mudar para `CONCLUIDA`.
4. Depois de concluida, permitir cadastrar TAG.

### Manutencao

Status:

```text
PENDENTE
EM_MANUTENCAO
CONCLUIDA
```

Fluxo sugerido:

1. Entrada via Synchro ou manual cria manutencao `PENDENTE` ou `EM_MANUTENCAO`.
2. Ao iniciar, preencher `dataInicio`, responsavel e diagnostico.
3. Durante manutencao, status `EM_MANUTENCAO`; exibir `diasManutencao`.
4. Ao concluir, preencher `dataTermino` e mudar para `CONCLUIDA`.

## Checklist de Telas para o Front-end

### Login

- Usar `/auth/login`.
- Guardar token.
- Proteger rotas.
- Logout limpando token.
- Tratar sessao expirada.

### Producao - Lista

- Listar com paginacao real.
- Filtros:
  - numero da ordem
  - numero de serie
  - modelo
  - TAG
  - status
  - tipo de equipamento
- Ordenacao.
- Cards/contadores por status.
- Acoes:
  - visualizar
  - editar
  - excluir/inativar
  - cadastrar TAG quando concluida

### Producao - Formulario

- Usar campos reais do DTO.
- Buscar tipos de equipamento.
- Nao pedir `numeroOrdem` manualmente.
- Nao pedir `numeroSerie` manualmente, ou deixar somente leitura.
- Usar booleans para documentos.
- Enviar itens seriados como lista de descricao.
- Adicionar observacoes pela rota propria.

### Inspecao de Montagem

- Selecionar uma producao.
- Buscar registros da producao.
- Editar e salvar registros reais.
- Exibir pendentes/conformes/nao conformes.
- PDF deve usar os dados persistidos.

### Historico do Equipamento

- Tela de auditoria das alteracoes.
- Nao criar historico manual, a menos que o backend seja expandido.
- Mostrar campo, valor anterior, valor novo, autor e data.

### Manutencao - Lista

- Listar com paginacao real.
- Filtros por status, TAG, serie, tipo, modelo.
- Contadores por status.
- Exibir `diasManutencao`.
- Acoes:
  - visualizar
  - editar
  - concluir
  - excluir/inativar
  - ver historico

### Manutencao - Edicao

- Usar `PATCH /manutencoes/:id`.
- Campos:
  - diagnostico
  - responsavelManutencao
  - statusManutencao
  - dataInicio
  - dataTermino
- Ao salvar, atualizar tela e historico.

### Tipos de Equipamento

- CRUD basico.
- Usar nos formularios de producao.
- Ativar/inativar.

## Gaps Reais Entre Front e Back

1. O front ainda nao explora filtros/paginacao de producao.
2. O front ainda nao explora filtros/paginacao de manutencao.
3. Manutencao ainda precisa de edicao completa.
4. Manutencao ainda precisa exibir status e contagem.
5. Manutencao ainda precisa exibir `diasManutencao`.
6. Historico de manutencao ainda nao esta visivel.
7. TAG de producao ainda nao tem fluxo completo no front.
8. Observacoes de producao precisam virar lista com endpoint proprio.
9. Tipos de equipamento ainda precisam ser usados no front.
10. Inspecao de montagem precisa respeitar exatamente os registros persistidos ou o backend precisa ser expandido.
11. Historico do equipamento no front deve ser tratado como auditoria automatica, nao formulario manual.
12. Delete logico precisa aparecer na UI como inativar/excluir.

## Campos do Back-end Ainda Nao Usados ou Usados Parcialmente no Front

Esta secao e importante para o front-end entender exatamente onde a tela atual esta menor que o contrato do back-end. A ideia nao e apenas "chamar a API", mas representar o fluxo real do sistema.

## Producao: Campos do Back-end x Uso Atual no Front

Modelo no back-end: `Equipment`.

### Campos principais

| Campo no back-end | Tipo | Uso atual no front | O que precisa fazer |
| --- | --- | --- | --- |
| `id` | string | Usado | Manter como identificador interno. |
| `numeroOrdem` | number autoincremental | Aparece no formulario como editavel | Deve ser somente leitura ou nem aparecer na criacao. O back gera automaticamente. |
| `numeroSerie` | string gerada pelo back | Aparece no formulario como editavel | Deve ser somente leitura. O back monta usando `modelo-numeroOrdem`. |
| `tag` | string unica | Nao ha fluxo completo | Criar acao especifica para cadastrar/editar TAG via `PATCH /producoes/:id/tag`. |
| `dataSolicitacao` | date | Usado | Manter. |
| `solicitante` | string | Nao usado | Adicionar campo "Solicitante" no formulario de producao. |
| `dataInicio` | date | Nao usado no formulario atual | Adicionar campo para iniciar producao e calcular fluxo de status. |
| `dataTermino` | date | Parcialmente usado | Campo existe no front novo, mas precisa ser enviado corretamente e exibido nas listas/detalhes. |
| `statusProducao` | enum | Nao usado corretamente no formulario/lista | Adicionar select/controle de status. |
| `tipoEquipamentoId` | string FK | Nao usado | Front deve buscar `/tipos-equipamento` e enviar o ID selecionado. |
| `tipoEquipamento` | objeto relacionado | Nao usado | Exibir nome do tipo nas listas/detalhes. |
| `modelo` | string | Usado | Manter. |
| `descricao` | string gerada no back | Front envia como `descricaoComplemento` via mapper | Ajustar texto da UI para deixar claro que e complemento/descricao do equipamento. |
| `listaPecas` | boolean | Parcialmente usado como texto | Trocar textarea por checkbox/toggle. |
| `sequenciaMontagem` | boolean | Parcialmente usado como texto `sequencialMontagem` | Trocar textarea por checkbox/toggle e alinhar nome. |
| `inspecaoMontagem` | boolean | Parcialmente usado como texto | Trocar textarea por checkbox/toggle. |
| `historicoEquipamento` | boolean | Parcialmente usado como texto | Trocar textarea por checkbox/toggle. |
| `procedimentoTesteInspecaoMontagem` | boolean | Parcialmente usado como texto `procedimentoTestes` | Trocar input por checkbox/toggle e alinhar nome. |
| `criadoEm` | datetime | Parcialmente exibido | Exibir em detalhes quando fizer sentido. |
| `atualizadoEm` | datetime | Parcialmente exibido | Exibir em detalhes/historico. |
| `ativo` | boolean | Nao usado | Usar para entender exclusao logica se um dia houver tela de inativos. |
| `excluidoEm` | datetime | Nao usado | Usar somente em tela administrativa/auditoria. |
| `diasSolicitacao` | calculado no service | Nao exibido | Exibir em lista/detalhe de producao. |
| `diasProducao` | calculado no service | Nao exibido | Exibir quando status for `EM_ANDAMENTO`. |

### Status de producao

Enum atual no schema:

```text
PROGRAMADA
PARALISADA
EM_ANDAMENTO
CONCLUIDA
```

Uso atual no front:

- Nao ha controle real de status na tela de criacao/edicao.
- Nao ha filtro por status.
- Nao ha contagem por status.
- `PARALISADA` foi adicionado no schema local, mas o relatorio anterior ainda nao mencionava.

O front precisa:

- Ter select de status na edicao/criacao, se fizer sentido operacional.
- Mostrar badge de status na lista.
- Permitir filtro por status.
- Ter contadores:
  - programadas
  - em andamento
  - paralisadas
  - concluidas
- Usar status para liberar acoes:
  - TAG apenas quando `CONCLUIDA`.
  - `diasProducao` principalmente em `EM_ANDAMENTO`.
  - se `PARALISADA`, exibir visualmente como alerta e talvez motivo futuramente, se o back ganhar campo de motivo.

### Payload ideal de criacao de producao no front

Hoje o front ainda mistura campos antigos/mockados com campos reais. O payload correto para o back deve seguir este formato:

```json
{
  "dataSolicitacao": "2026-04-29",
  "solicitante": "Joao Junior",
  "dataInicio": "2026-04-29",
  "dataTermino": "2026-05-02",
  "statusProducao": "PROGRAMADA",
  "tipoEquipamentoId": "uuid",
  "modelo": "CSEX420ACM",
  "descricaoComplemento": "Exaustor 420 monofasico",
  "listaPecas": true,
  "sequenciaMontagem": true,
  "inspecaoMontagem": true,
  "historicoEquipamento": true,
  "procedimentoTesteInspecaoMontagem": true,
  "itensSeriados": [
    {
      "descricao": "Motor W22Xdb carcaca 80"
    }
  ]
}
```

Campos que o front nao deve enviar na criacao:

- `id`
- `numeroOrdem`
- `numeroSerie`
- `tag`
- `criadoEm`
- `atualizadoEm`
- `ativo`
- `excluidoEm`
- `diasSolicitacao`
- `diasProducao`

### Campos atualmente perdidos no mapper do front

No hook `useProducoes`, o mapper atual nao leva todos os campos do backend para o tipo usado pela tela.

Campos recebidos do back que precisam ser mapeados/exibidos:

- `tag`
- `solicitante`
- `dataInicio`
- `dataTermino`
- `statusProducao`
- `tipoEquipamentoId`
- `tipoEquipamento.nome`
- `diasSolicitacao`
- `diasProducao`
- `ativo`
- `excluidoEm`, se houver tela de inativos

Campos que o front envia hoje de forma incompleta:

- `dataTermino`: existe no formulario, mas precisa estar no tipo e no mapper de envio.
- `statusProducao`: nao esta sendo enviado.
- `solicitante`: nao esta sendo enviado.
- `dataInicio`: nao esta sendo enviado.
- `tipoEquipamentoId`: nao esta sendo enviado.
- flags booleanas de documentos: hoje a UI usa textos; deveria usar boolean.

## Itens Seriados: Campos Ainda Nao Alinhados

Back-end:

```text
ItemSeriado
- id
- producaoID
- descricao
- criadoEm
```

Front antigo:

```text
- id
- numero
- descricao
- numeroSerie
```

Problema:

- O backend so persiste `descricao`.
- `numero` e `numeroSerie` do item existem no front, mas nao existem no schema atual.

Decisao necessaria:

1. Se esses campos sao obrigatorios no negocio, criar no schema:
   - `numero`
   - `numeroSerie`
2. Se nao sao obrigatorios, remover/ocultar do formulario do front.

## Documentos da Producao: Campos Ainda Nao Alinhados

Back-end usa booleanos:

- `listaPecas`
- `sequenciaMontagem`
- `inspecaoMontagem`
- `historicoEquipamento`
- `procedimentoTesteInspecaoMontagem`

Front antigo usa textos/codigos:

- `listaPecas`
- `sequencialMontagem`
- `inspecaoMontagem`
- `historicoEquipamento`
- `procedimentoTestes`
- `documentos[]`

Problema:

- O back nao persiste codigo/nome de documento, apenas se aquele documento se aplica ou nao.

Decisao necessaria:

1. Se basta indicar se existe documento: trocar UI para checkboxes.
2. Se precisa guardar codigo do documento, revisar schema/API para criar campos de codigo ou uma tabela de documentos.

## Manutencao: Campos do Back-end x Uso Atual no Front

Modelo no back-end: `Manutencao`.

| Campo no back-end | Tipo | Uso atual no front | O que precisa fazer |
| --- | --- | --- | --- |
| `id` | string | Usado | Manter. |
| `origem` | enum `SYNCHRO`/`MANUAL` | Parcialmente usado como texto local | Exibir origem na lista/detalhe. |
| `tipoEquipamentoNome` | string | Mapeado para `fabricante` | Renomear no front para tipo de equipamento, nao fabricante. |
| `modeloEquipamento` | string | Usado como modelo | Manter. |
| `numeroSerie` | string | Usado | Manter. |
| `tag` | string | Usado | Manter. |
| `situacaoEquipamento` | string | Mapeado para destino | Melhorar nome na UI para situacao. |
| `dataRetornoBase` | date | Parcialmente usado | Exibir em detalhe/lista. |
| `dataInicio` | date | Parcialmente usado como data da manutencao | Separar retorno, inicio e termino. |
| `dataTermino` | date | Nao usado | Adicionar na edicao/conclusao de manutencao. |
| `statusManutencao` | enum | Parcialmente convertido para avaliacaoFinal | Usar status real com badge/select. |
| `diagnostico` | string | Mapeado para observacoes | Criar campo especifico diagnostico. |
| `responsavelManutencao` | string | Mapeado para responsavel | Manter com nome real. |
| `criadoEm` | datetime | Parcialmente usado | Exibir se necessario. |
| `atualizadoEm` | datetime | Parcialmente usado | Exibir se necessario. |
| `ativo` | boolean | Nao usado | Usar para exclusao logica/tela de inativos. |
| `excluidoEm` | datetime | Nao usado | Usar em auditoria/tela de inativos. |
| `diasManutencao` | calculado no service | Nao exibido | Exibir quando status for `EM_MANUTENCAO`. |
| `historicoAlteracoes` | relacao | Nao usado na tela | Criar aba/modal de historico. |

### Status de manutencao

Enum atual no schema:

```text
PENDENTE
PARALISADA
EM_MANUTENCAO
CONCLUIDA
```

Uso atual no front:

- O front transforma `CONCLUIDA` em `avaliacaoFinal = CONFORME`.
- Isso perde os estados reais `PENDENTE`, `PARALISADA` e `EM_MANUTENCAO`.
- Nao existe tela de edicao completa de manutencao.
- Nao existem contadores por status.

O front precisa:

- Exibir status real da manutencao.
- Permitir alterar status via `PATCH /manutencoes/:id`.
- Mostrar badges:
  - pendente
  - em manutencao
  - paralisada
  - concluida
- Exibir `diasManutencao` quando `EM_MANUTENCAO`.
- Ter filtros por status.
- Ter contadores por status.

### Payload correto para editar manutencao

Endpoint:

```http
PATCH /manutencoes/:id
```

Payload:

```json
{
  "diagnostico": "Troca de rolamento e revisao completa",
  "responsavelManutencao": "Joao da Silva",
  "statusManutencao": "EM_MANUTENCAO",
  "dataInicio": "2026-04-29",
  "dataTermino": "2026-05-01"
}
```

Campos que faltam em tela:

- `diagnostico`
- `responsavelManutencao` com nome correto
- `statusManutencao`
- `dataInicio`
- `dataTermino`

Campos que o front deve exibir, mas nao editar diretamente:

- `origem`
- `dataRetornoBase`, dependendo da origem
- `diasManutencao`
- `historicoAlteracoes`

## Filtros, Paginacao e Contagens Ainda Nao Usados

### Producao

Back-end aceita:

- `page`
- `limit`
- `numeroOrdem`
- `numeroSerie`
- `modelo`
- `tag`
- `statusProducao`
- `tipoEquipamentoId`
- `sortBy`
- `sortOrder`

Front atual:

- Busca `limit: 100`.
- Nao usa paginacao real.
- Nao usa filtros.
- Nao usa ordenacao.

Necessario:

- Criar estado de filtros.
- Enviar filtros como query params.
- Renderizar paginacao usando `total`, `page`, `limit`, `totalPages`.
- Criar contadores por status.

### Manutencao

Back-end aceita:

- `page`
- `limit`
- `statusManutencao`
- `tag`
- `numeroSerie`
- `tipoEquipamentoNome`
- `modeloEquipamento`
- `sortBy`
- `sortOrder`

Front atual:

- Busca `limit: 100`.
- Nao usa paginacao real.
- Nao usa filtros.
- Nao usa ordenacao.
- Nao exibe contagens por status.

Necessario:

- Filtros de manutencao.
- Tabela/lista paginada.
- Contadores por status.
- Ordenacao por data/status.

## Campos de Historico Ainda Pouco Usados

### HistoricoProducao

Campos:

- `campo`
- `valorAnterior`
- `valorNovo`
- `alteradoPor`
- `criadoEm`

Uso necessario:

- Mostrar como auditoria.
- Nao tratar como formulario manual.
- Dar destaque para mudancas de status, datas e TAG.

### HistoricoManutencao

Campos:

- `campo`
- `valorAnterior`
- `valorNovo`
- `alteradoPor`
- `criadoEm`

Uso necessario:

- Criar visualizacao no detalhe da manutencao.
- Mostrar historico apos cada edicao.
- Dar destaque para mudancas de status, diagnostico, responsavel, dataInicio e dataTermino.

## Sugestao de Ordem de Implementacao no Front

1. Consolidar autenticacao e interceptors.
2. Ajustar Producao para contrato real completo.
3. Implementar tipos de equipamento no formulario de producao.
4. Implementar filtros, paginacao e contadores de producao.
5. Implementar edicao/status/datas de producao.
6. Implementar TAG e observacoes.
7. Implementar Manutencao lista com filtros, paginacao e contadores.
8. Implementar edicao de manutencao.
9. Implementar historico de manutencao.
10. Revisar Inspecao de Montagem contra formulario oficial.
11. Decidir se historico manual do equipamento e requisito; se for, criar backend especifico.

## Pontos de Atencao Para o Time

- Nao recriar regras no front quando o backend ja calcula, como `diasProducao` e `diasManutencao`.
- Nao usar mocks em telas que ja possuem endpoint.
- Nao enviar campos que o DTO nao aceita, pois o `ValidationPipe` usa `whitelist` e `forbidNonWhitelisted`.
- Preferir componentes que espelhem os enums reais do Prisma.
- Tratar erros do backend com as mensagens retornadas pela API.
- Separar dados de producao, observacoes, inspecao e historico; eles sao recursos diferentes.
