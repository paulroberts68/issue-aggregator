var Q = require("q");
var https = require("https");

var kanboard = null;
var testing = true;

var trello = {
	kanboardImport: function(board, cards) {
		kanboard.createProject(board.name)
			.then((res) => {
				var projectID = res.result;
				kanboard.removeAllColumns(projectID)
					.then(() => {
						//kanboard.addColumns(projectID, board.lists.map(column => column.name));

						var resolvedDeferred = Q.defer();
						var lastPromise = resolvedDeferred.promise;
						resolvedDeferred.resolve();

						var columns = board.lists;
						columns.forEach(function (column) {
							var deferred = Q.defer();

							lastPromise.then(() => {
								kanboard.addColumn(projectID, column.name).then((res) => {
									var columnID = res.result;
									var columnCards = cards.filter((card) => card.idList == column.id);

									columnCards.forEach((card) => kanboard.createTask(projectID, columnID, card.name));
								});

								setTimeout(() => deferred.resolve(), 5000);
							});

							lastPromise = deferred.promise;
						});
					});
			});
	},

	getCards: function(boardID, apiKey, membershipToken) {
		var deferred = Q.defer();

		var options = {
			hostname: "api.trello.com",
			path: `/1/boards/${boardID}/cards?fields=name,idList,url,desc&key=${apiKey}&token=${membershipToken}`,
			method: "GET"
		};

		if (!testing) {
			var req = https.request(options, (response) => {
				response.setEncoding("utf8");

				var body = "";
				response.on("data", (d) => {
					body += d;
				})

				response.on("end", () => {
					var cards = JSON.parse(body);
					deferred.resolve(cards);
				});
			});

			req.on('error', function(err) {
				deferred.reject(err);
			});

			req.end();
		} else {
			var cards = [{"id":"56d8aafd27a67184b37c0625","name":"18f guide framework","idList":"56d8aae8b9c0fc368f2c3dad","desc":"","url":"https://trello.com/c/YddWR1gO/46-18f-guide-framework"},{"id":"56d8ab527c5afb3613c1918f","name":"SCM Pattern Language","idList":"56d8aae8b9c0fc368f2c3dad","desc":"","url":"https://trello.com/c/FMjvMHmU/47-scm-pattern-language"},{"id":"56d8ab881b99393053cada99","name":"RefCards","idList":"56d8aae8b9c0fc368f2c3dad","desc":"","url":"https://trello.com/c/bQfUoliK/48-refcards"},{"id":"56d8ac23c7a7f22753efa51f","name":"US Gov Playbook","idList":"56d8aae8b9c0fc368f2c3dad","desc":"","url":"https://trello.com/c/Etxxz2W5/49-us-gov-playbook"},{"id":"56d8ac79f7b98b6249b0bb9e","name":"US Private PaaS (cloud.gov)","idList":"56d8aae8b9c0fc368f2c3dad","desc":"","url":"https://trello.com/c/UI2kQIxy/50-us-private-paas-cloud-gov"},{"id":"56d8acea26c237de712d0357","name":"TechFAR digital service procurement guide","idList":"56d8aae8b9c0fc368f2c3dad","desc":"","url":"https://trello.com/c/FJ4KOteb/51-techfar-digital-service-procurement-guide"},{"id":"56d9c867da1beff6084cc375","name":"Manifestly - SOP/repeatable process tool","idList":"56d8aae8b9c0fc368f2c3dad","desc":"","url":"https://trello.com/c/0b0uksRg/52-manifestly-sop-repeatable-process-tool"},{"id":"56d9d9c006636f60740906d0","name":"IA/Domain Model Sketch","idList":"56d8aae8b9c0fc368f2c3dad","desc":"","url":"https://trello.com/c/GHHXJ7Wn/54-ia-domain-model-sketch"},{"id":"56d9ca426da88e1f6160d948","name":"Service Blueprint","idList":"56d8aae8b9c0fc368f2c3dad","desc":"","url":"https://trello.com/c/1qxjLHPE/53-service-blueprint"},{"id":"56da5c5e55d3eac634cd3dde","name":"Faceted Navigation","idList":"56d8aae8b9c0fc368f2c3dad","desc":"","url":"https://trello.com/c/zXIa1Kui/55-faceted-navigation"},{"id":"56da5ff2396319f8010ccc56","name":"Visio to SVG (for webified EBA)","idList":"56d8aae8b9c0fc368f2c3dad","desc":"","url":"https://trello.com/c/H0L7Avw6/56-visio-to-svg-for-webified-eba"},{"id":"56e20b5c28f0566ea3171ebf","name":"Jekyll Docs ","idList":"56d8aae8b9c0fc368f2c3dad","desc":"","url":"https://trello.com/c/Pxgf2Xx0/73-jekyll-docs"},{"id":"56e20b8201e61a1875a37e9b","name":"Liquid Tag reference","idList":"56d8aae8b9c0fc368f2c3dad","desc":"","url":"https://trello.com/c/9nchym5G/74-liquid-tag-reference"},{"id":"56e20f1ac2108f8d951fdc79","name":"Kanboard (OS Kanban board)","idList":"56d8aae8b9c0fc368f2c3dad","desc":"","url":"https://trello.com/c/P4SySYdT/75-kanboard-os-kanban-board"},{"id":"56a95eb1527ae49151cebef3","name":"Complete Business Model Canvass for service design","idList":"56a95c4b37f89ee882420f35","desc":"","url":"https://trello.com/c/g0S1sMbt/13-complete-business-model-canvass-for-service-design"},{"id":"56d0e84bc30f288c3f7bfad3","name":"change management plan for mode 1 process rollout","idList":"56a95c4b37f89ee882420f35","desc":"","url":"https://trello.com/c/s50STpqc/37-change-management-plan-for-mode-1-process-rollout"},{"id":"56e1f21f6145436368fae928","name":"Engage Strategic Planning & Policy (N.Sedmak) for Visibility and Transparency.","idList":"56a95c4b37f89ee882420f35","desc":"","url":"https://trello.com/c/JJQUe7C6/71-engage-strategic-planning-policy-n-sedmak-for-visibility-and-transparency"},{"id":"56e356c3b266c811d7383e3d","name":"adapt Mode 1 Playbook to playbook framework","idList":"56a95c4b37f89ee882420f35","desc":"","url":"https://trello.com/c/yIKgWLXx/78-adapt-mode-1-playbook-to-playbook-framework"},{"id":"56e6e78dee4edae268307c9b","name":"prepare Service Architecture Document (SAD) for capture (a \"form\"?)","idList":"56a95c4b37f89ee882420f35","desc":"","url":"https://trello.com/c/cL9LHnPp/79-prepare-service-architecture-document-sad-for-capture-a-form"},{"id":"56e6e7ad34ea04757235ac27","name":"Implement a back-end store for the SAD","idList":"56a95c4b37f89ee882420f35","desc":"","url":"https://trello.com/c/jrRsuZaq/80-implement-a-back-end-store-for-the-sad"},{"id":"56e6e7d42a8ca3e70ed27b29","name":"Create SAD collection presentation UI","idList":"56a95c4b37f89ee882420f35","desc":"","url":"https://trello.com/c/gyJ0nkHi/81-create-sad-collection-presentation-ui"},{"id":"56e9e49fb4f2add8150ab634","name":"Change ownership of Agile Guide repo","idList":"56a95c53a811b9badc438422","desc":"","url":"https://trello.com/c/JESIFaXD/84-change-ownership-of-agile-guide-repo"},{"id":"56e72d4a837d138dc09ba9e6","name":"Interactive EBA graphic widget","idList":"56a95c53a811b9badc438422","desc":"","url":"https://trello.com/c/l1I2RIx6/82-interactive-eba-graphic-widget"},{"id":"56e340990fa555159cf28404","name":"Create Dockerfile to run Kanboard on OpenShift","idList":"56a95c53a811b9badc438422","desc":"","url":"https://trello.com/c/NRnSAoyf/76-create-dockerfile-to-run-kanboard-on-openshift"},{"id":"56e064814da8b7c2ac1c6ebf","name":"Figure out how to provide some form of transparency across the SDUs","idList":"56a95c53a811b9badc438422","desc":"","url":"https://trello.com/c/JbcO5NJA/58-figure-out-how-to-provide-some-form-of-transparency-across-the-sdus"},{"id":"56e06c1ca24312045749e9f4","name":"Create passage in Chpt 12 exception that prevents castle buliding","idList":"56a95c53a811b9badc438422","desc":"","url":"https://trello.com/c/z5bo4Gq5/60-create-passage-in-chpt-12-exception-that-prevents-castle-buliding"},{"id":"56d622ddec5b3cd69cdbcc75","name":"First modification of playbook content","idList":"56a95c53a811b9badc438422","desc":"","url":"https://trello.com/c/Yb3agONI/42-first-modification-of-playbook-content"},{"id":"56d785ed04f07548d454ca83","name":"determine initial mode 1 process : store","idList":"56a95c53a811b9badc438422","desc":"","url":"https://trello.com/c/WFWYtJtD/44-determine-initial-mode-1-process-store"},{"id":"56d78602842ed4d9d6f69a8a","name":"determine initial mode 1 process : process governance","idList":"56a95c53a811b9badc438422","desc":"Process governance:\n- Portfolio Mgmt & clarity report for TS-SMT","url":"https://trello.com/c/iStzMAY2/45-determine-initial-mode-1-process-process-governance"},{"id":"56e078d0f8dd212fdb122db5","name":"Publish Mode 1 )(Quartech) Playbook on POC website","idList":"56a95c53a811b9badc438422","desc":"","url":"https://trello.com/c/gIS7LuZq/66-publish-mode-1-quartech-playbook-on-poc-website"},{"id":"56e3569b0da9779831b03589","name":"adapt EBA Content to playbook framework","idList":"56a95c53a811b9badc438422","desc":"","url":"https://trello.com/c/vkL5znTp/77-adapt-eba-content-to-playbook-framework"},{"id":"56d4e6a08e61bc7cd99a12da","name":"Create frame work for the Digital Guide","idList":"56a95c53a811b9badc438422","desc":"","url":"https://trello.com/c/lUfPKM0h/39-create-frame-work-for-the-digital-guide"},{"id":"56b0e07d727d703e2db32aa2","name":"Create goals for service catalogue","idList":"56a95c53a811b9badc438422","desc":"","url":"https://trello.com/c/eyFyEhTD/25-create-goals-for-service-catalogue"},{"id":"56b0e0e8285c79381c83c587","name":"Create project on a page","idList":"56a95c53a811b9badc438422","desc":"","url":"https://trello.com/c/BC5Mg4H2/27-create-project-on-a-page"},{"id":"56b0e0b979b194da196501ae","name":"Create goals for SD process","idList":"56a95c53a811b9badc438422","desc":"","url":"https://trello.com/c/eZwbDyxn/26-create-goals-for-sd-process"},{"id":"56e0637d4ecfd6ad15eb7a95","name":"EBA published on POC website","idList":"56a95c53a811b9badc438422","desc":"","url":"https://trello.com/c/AxsgMgco/57-eba-published-on-poc-website"},{"id":"56e09f5ed708afd7cb82dc38","name":"Deploy guide publishing component to OpenShift","idList":"56a95c5bbc33082814b7ec81","desc":"","url":"https://trello.com/c/GgENFv16/69-deploy-guide-publishing-component-to-openshift"},{"id":"56e06c373519103526e5e32e","name":"Work with Susan Wood to request exception because of mode 2","idList":"56a95c5bbc33082814b7ec81","desc":"","url":"https://trello.com/c/JrPytQbb/61-work-with-susan-wood-to-request-exception-because-of-mode-2"},{"id":"56e06c6b0ae32754373aa30a","name":"Create feedback loop to prevent Chpt 12 exception castle building","idList":"56a95c5bbc33082814b7ec81","desc":"","url":"https://trello.com/c/283lnsxL/62-create-feedback-loop-to-prevent-chpt-12-exception-castle-building"},{"id":"56c4dca16b77b3bce2b23bf4","name":"Create framework for a strategic cafe/workshop.","idList":"56a95c5bbc33082814b7ec81","desc":"","url":"https://trello.com/c/9G21Obm2/32-create-framework-for-a-strategic-cafe-workshop"},{"id":"56b0e0718ae13f91e51463af","name":"Create vision for SD process","idList":"56a95c5bbc33082814b7ec81","desc":"","url":"https://trello.com/c/tQmZFmub/24-create-vision-for-sd-process"},{"id":"56e078273975ccd8fb1db6c5","name":"Investigate issue aggregation tools/services.","idList":"56a95c5bbc33082814b7ec81","desc":"","url":"https://trello.com/c/Yn6wD6W6/64-investigate-issue-aggregation-tools-services"},{"id":"56d0e8212db1f81e68660bb8","name":"determine initial mode 1 process : process artifacts","idList":"56a95c5bbc33082814b7ec81","desc":"","url":"https://trello.com/c/InyZhaji/36-determine-initial-mode-1-process-process-artifacts"},{"id":"56cca097d2106618595066be","name":"Create SDPortfolio schematic","idList":"56a95c5bbc33082814b7ec81","desc":"","url":"https://trello.com/c/mXd9QVwx/35-create-sdportfolio-schematic"},{"id":"56e9d3c97bdc62c723df695c","name":"UX/UI research and initial design concepts for entry page.","idList":"56a95c5bbc33082814b7ec81","desc":"","url":"https://trello.com/c/k5d6yl1n/83-ux-ui-research-and-initial-design-concepts-for-entry-page"},{"id":"56e20670fbb9a121161b5ba0","name":"Onboard Carol Howard","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/MKf5UUTH/72-onboard-carol-howard"},{"id":"56e09eebc0a96f8fcc6ca7c1","name":"Walkthrough/document guide creation and editing process","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/UPYvVAaa/67-walkthrough-document-guide-creation-and-editing-process"},{"id":"56e09f47fd695760128d565a","name":"Deploy a sample guide to OpenShift","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/skEJUWda/68-deploy-a-sample-guide-to-openshift"},{"id":"56a95dea75eaea172df50141","name":"Establish project budget","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/r9bTNmr7/10-establish-project-budget"},{"id":"56c79d4358e9da37fef91d9c","name":"Create an ASPB interpretation of Chapter 12 regarding development i.e. government departments can create software scaling with private partners appropriately.","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/MztqmLoN/33-create-an-aspb-interpretation-of-chapter-12-regarding-development-i-e-government-departments-can-create-software-scaling-with-pr"},{"id":"56b24b40c8fddd592e9fc64c","name":"Define the ASPB definition of product for the Agile Government Framework.","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/80kcNaUo/29-define-the-aspb-definition-of-product-for-the-agile-government-framework"},{"id":"56e0785b1f02bfaed1c51e9f","name":"Digitize Mode 1 (Quartech) Playbook","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/2zFn7oWM/65-digitize-mode-1-quartech-playbook"},{"id":"56e1afe7bc4044c5f4f6cddc","name":"drop Digitized EBA document into  the BCDev org.","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/bgWACfit/70-drop-digitized-eba-document-into-the-bcdev-org"},{"id":"56d4e6ad3a4dcb3129ae7ea1","name":"Design technical framework","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/X08HBc6g/40-design-technical-framework"},{"id":"56cb7d644b43d5ceb7fe82e9","name":"Create task list for the Quartec contractors","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/nuOAvHRl/34-create-task-list-for-the-quartec-contractors"},{"id":"56b0e067b1680cbec5ccb228","name":"Create vision for service catalogue","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/d3hnSFE1/23-create-vision-for-service-catalogue"},{"id":"56a96246633e7037134dc7f8","name":"Establish portfolio backlog","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/Ls4fUFtC/16-establish-portfolio-backlog"},{"id":"56a95dd8cb4fafa72d2e9a87","name":"Identify project team","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/hkESUHOo/8-identify-project-team"},{"id":"56a95ecbab32f1b0288e8b44","name":"Create 1,2,3 - ALL workshop to refine scope statement","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/hlBZxBZZ/14-create-1-2-3-all-workshop-to-refine-scope-statement"},{"id":"56a95d8b65fceb8ab560cad9","name":"Find template for “a project on a page”","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/RghCdjrL/1-find-template-for-a-project-on-a-page"},{"id":"56c4dc6f6279a5b656618a13","name":"Get digital play books from CIO US, UK, California and 18F. Read and outline framework for process.","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/O4L5sDGy/31-get-digital-play-books-from-cio-us-uk-california-and-18f-read-and-outline-framework-for-process"},{"id":"56afbdc888f5e74192e9318d","name":"Select software projects from the current list in clarity","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/wZRrX6bW/19-select-software-projects-from-the-current-list-in-clarity"},{"id":"56b0e04109455c243189c196","name":"Create agenda for think-tank workshop","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/TkhSQioK/22-create-agenda-for-think-tank-workshop"},{"id":"56d0e908a7fac95052715560","name":"design methodology & frequency for mode 1 process change","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/k6MuIkVR/38-design-methodology-frequency-for-mode-1-process-change"},{"id":"56a95dff22deaef9331b6c76","name":"Establish project hierarchy","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/sGiViAvC/12-establish-project-hierarchy"},{"id":"56a9625b8c9249cf8dc79421","name":"Establish pathfinders for SD project","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/FGTYWHH5/17-establish-pathfinders-for-sd-project"},{"id":"56a95da33ecade6282111b83","name":"Create project goals","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/7OIhR2Qo/3-create-project-goals"},{"id":"56a95dad40340db40702fe8d","name":"Create high level milestones","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/q85qeQDI/4-create-high-level-milestones"},{"id":"56afdaa0ba8a4045dea48845","name":"Identify SCRUM team roles","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/M31WOhER/21-identify-scrum-team-roles"},{"id":"56a95dce43643e15e03c660f","name":"Establish how the project collaborates on documents","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/Aj4Aqucc/7-establish-how-the-project-collaborates-on-documents"},{"id":"56abf44db48e376bf1ed230b","name":"re-engage Quartech, with briefing and assignment of responsibilities","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/eULyBKqt/18-re-engage-quartech-with-briefing-and-assignment-of-responsibilities"},{"id":"56a95f2e7fe7ddca7f90a84c","name":"Create \"think-tank' for change management team","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/eOpjnTBs/15-create-think-tank-for-change-management-team"},{"id":"56ba72274b851a08f4f0a73d","name":"Prepare agenda for stakeholders' workshop (on Friday 12th Feb.)","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/S9Ytrytc/30-prepare-agenda-for-stakeholders-workshop-on-friday-12th-feb"},{"id":"56e064a6f4ff1e392c265461","name":"Create an affinity exercise across the SDUs as part of Mode 1/2 process","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/pyqC9I3F/59-create-an-affinity-exercise-across-the-sdus-as-part-of-mode-1-2-process"},{"id":"56d77226fbe8d8a5d5bc3e61","name":"Solution design - Mode 1 vs Mode 2 decision tree.","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"As a playbook starting point users need a context point for self identifying if Mode 1 or Mode 2 patterns are the best fit for the initiative. Use the liquid planner Agile vs waterfall for inspiration.\n\nhttps://www.liquidplanner.com/blog/agile-v-waterfall-which-project-management-style-is-right-for-you/","url":"https://trello.com/c/vxGStFh0/43-solution-design-mode-1-vs-mode-2-decision-tree"},{"id":"56a95d99d8888ad9badca952","name":"Create initial scope statement for the project","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"","url":"https://trello.com/c/k2TEH8eg/2-create-initial-scope-statement-for-the-project"},{"id":"56d6201029273c4162ad85c6","name":"Digitize the EBA and put content into the BCDev org.","idList":"56a95c5ed9cdc98fbfd2efd2","desc":"DOD\n1. Converted to markdown\n","url":"https://trello.com/c/7DjpXECU/41-digitize-the-eba-and-put-content-into-the-bcdev-org"}];
			deferred.resolve(cards);
		}

		return deferred.promise;
	},

	getBoardByID: function(boardID, apiKey, membershipToken) {
		var deferred = Q.defer();

		var options = {
			hostname: "api.trello.com",
			path: `/1/boards/${boardID}?lists=open&list_fields=name&fields=name,desc&key=${apiKey}&token=${membershipToken}`,
			method: "GET"
		};

		if (!testing) {
			var req = https.request(options, (response) => {
				response.setEncoding("utf8");

				var body = "";
				response.on("data", (d) => {
					body += d;
				});
				response.on("end", () => {
					var board = JSON.parse(body);
					deferred.resolve(board);
				})
			});

			req.on('error', function(err) {
				deferred.reject(err);
			});

			req.end();
		} else {
			var board = {"id":"56a95c296ba220341b58cb68","name":"Service Design","desc":"","lists":[{"id":"56d8aae8b9c0fc368f2c3dad","name":"References"},{"id":"56a95c4b37f89ee882420f35","name":"Backlog"},{"id":"56a95c53a811b9badc438422","name":"Sprint backlog"},{"id":"56a95c5bbc33082814b7ec81","name":"In progress"},{"id":"56a95c5ed9cdc98fbfd2efd2","name":"Done"}]};
			deferred.resolve(board);
		}

		return deferred.promise;
	},

	import: function(boardID, apiKey, membershipToken, kanboardModule, testingFlag) {
		kanboard = kanboardModule;
		testing = testingFlag;
		//kanboard.clearBoards();
		trello.getBoardByID(boardID, apiKey, membershipToken).then((board) => {
			trello.getCards(boardID, apiKey, membershipToken).then((cards) => {
				trello.kanboardImport(board, cards);
			})
		});
	}

}

module.exports = trello;