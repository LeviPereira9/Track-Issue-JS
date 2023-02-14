// Adicionando o submit do formulário.
document.querySelector("#issueInputForm").addEventListener("submit", saveIssue);

function saveIssue(e) {
    //Usando aquela biblioteca adicionada.
    let issueId = chance.guid();
    //Pegando informações do form
    let issueDesc = document.querySelector("#issueDescInput").value;
    let issueSeverity = document.querySelector("#issueSeverityInput").value;
    let issueAssignedTo = document.querySelector("#issueAssignedToInput").value;
    let issueCategory = document.querySelector("#issueCategory").value;
    let issueStatus = "Open";

    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();


    //Corpo do localStorage.
    const issue = {
        id: issueId,
        description: issueDesc,
        severity: issueSeverity,
        assignedTo: issueAssignedTo,
        status: issueStatus,
        category: issueCategory,
        createdAt: `${date} - ${time}`,
        closedAt: null
    };

    //Se não tiver, criar um array e adicionar os issues.
    //Se tiver, recupera para obj, adiciona e depois manda dnv.
    if (localStorage.getItem("issues") === null){
        let issues = [];
        issues.push(issue);
        localStorage.setItem("issues", JSON.stringify(issues));
    } else {
        let issues = JSON.parse(localStorage.getItem("issues"));
        issues.push(issue);
        localStorage.setItem("issues", JSON.stringify(issues));
    }

    document.querySelector("#issueInputForm").reset();
    fetchIssues();
    
    e.preventDefault();
}

// Mudar o status para fechado.
function setStatusClosed(id) {
    const issues = JSON.parse(localStorage.getItem("issues"));
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();

    for (let c = 0; c < issues.length; c++){
        if(issues[c].id == id) {
            issues[c].status = "Closed";
            issues[c].closedAt = `${date} - ${time}`;
        }
    }

    localStorage.setItem("issues", JSON.stringify(issues));
    fetchIssues();
}

// Deletando uma issue.
function deleteIssue(id) {
    const issues = JSON.parse(localStorage.getItem("issues"));

    for (let c = 0; c < issues.length; c++) {
        if (issues[c].id == id){
            issues.splice(c, 1);
        }
    }

    localStorage.setItem("issues", JSON.stringify(issues));
    fetchIssues();
}

// Recuperar dados do localStorage e preparar a lista.
function fetchIssues() {
    const issues = JSON.parse(localStorage.getItem("issues"));
    const issuesList = document.querySelector("#issuesList");

    issuesList.innerHTML = "";

    for (let c = 0; c < issues.length; c++) {
        // Recuperando...
        let id = issues[c].id;
        let desc = issues[c].description;
        let severity = issues[c].severity;
        let assignedTo = issues[c].assignedTo;
        let status = issues[c].status;
        let category = issues[c].category;
        let createdAt = issues[c].createdAt;
        let closedAt = issues[c].closedAt;
        let classStatus;
        
        if(status === "Open"){
            classStatus = "btn-info";
        } else {
            classStatus = "btn-success";
        }

        //Adicionando as issues.
        issuesList.innerHTML += `
            <div class="issue row mb-2">
                <p class="h6 col-md-12 text-center"> Issue ID: ${id} </p>
                <span 
                    class="statusDetail text-center mb-2"
                    > 
                    Aberto: ${createdAt} ${closedAt ? ` | Fechado: ${closedAt} `: ""}
                </span>
                <hr>
                <p class="col-md-1 me-3">
                    <span class="label label-info btn ${classStatus} mt-4 statusBtn">${status}</span>
                </p>
                <div class="statusInfo mt-2 col-md-10">
                    <p class="h5 mb-2"> #${category} </p>
                    <p class="mb-4">${desc} </p>
                    <p>
                        <i class="bi bi-stopwatch"></i> <span class="me-3">${severity}</span>
                        <i class="bi bi-person-fill"></i> <span>${assignedTo}</span>
                    </p>
                </div>
                <hr>
                <div class="text-center col-md-12">
                    <a
                        href="#"
                        class="btn btn-warning col-md-1 me-3 statusBtn"
                        onclick="setStatusClosed('${id}')"
                        >
                        Close
                    </a>
                    <a
                        href="#"
                        class="btn btn-danger col-md-1 statusBtn"
                        onclick="deleteIssue('${id}')"
                        >
                        Delete
                    </a>
                </div>
            </div>
            `;
    }
}

fetchIssues();