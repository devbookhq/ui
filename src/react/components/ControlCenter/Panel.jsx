import React, { Component, Suspense } from 'react';
import './App.css';
import { jsPanel } from 'jspanel4/es6module/jspanel';
import 'jspanel4/dist/jspanel.min.css';

// Normal components
import ActionButton from './components/ActionButton';
import CreatePortal from './components/createPortal';
import Editor from '../Editor';

// jsPanel default options
const jsPanelOptions = {
	theme: '#292929',
	headerControls: {
		minimize: 'remove',
		smallify: 'remove',
		close: 'remove',
		maximize: 'remove',
	},
	position: 'center-top 0 20%',
	contentSize: {
		width: `${Math.round(window.innerWidth / 1.2)}px`,
		height: `auto`
	},
	contentOverflow: 'auto',
	onwindowresize: false,
	content: panel => {
		const div = document.createElement('div');
		const newId = `${panel.id}-node`;
		div.id = newId;
		panel.content.append(div);
	},
	callback: panel => {
		panel.content.style.padding = '10px';
		const maxHeight = window.innerHeight - (window.innerHeight * 30) / 100;
		panel.content.style.maxHeight = `${maxHeight}px`;
		panel.content.style.maxWidth = `${window.innerWidth - 20}px`;
	},
	onclosed: () => { }
};

// Top level React component
class Panel extends Component {
	constructor() {
		super();
		this.state = {
			panels: {}
		};
	}

	createJsPanel = (action, comp, modal = false) => {
		// keep Main component refrence
		const app = this;
		// check if its already mounted, bring it to front
		if (app.state.panels[action]) {
			return app.state.panels[action]['panel'].front(() => {
				app.state.panels[action]['panel'].resize({
					height: 'auto'
				});
				app.state.panels[action]['panel'].reposition('center-top 0 20%');
			});
		}

		const options = {
			...jsPanelOptions,
			headerTitle: 'Devbook',
			onclosed: () => {
				// remove closed jsPanel and its mounted component from state
				const appPanels = app.state.panels;
				if (appPanels[action]) {
					delete appPanels[action];
					app.setState({ panels: { ...appPanels } });
				}
			}
		};
		// create jsPanel
		const panel = modal ? jsPanel.modal.create(options) : jsPanel.create(options);
		// save panel and compponent (this will be mounted later inside panel body) reference inside state
		app.setState({ panels: { ...app.state.panels, [action]: { panel, comp } } });
	};

	renderJsPanlesInsidePortal() {
		const panels = this.state.panels;
		return Object.keys(panels).map(action => {
			const jsPanel = panels[action].panel;
			const Comp = panels[action].comp;
			const node = document.getElementById(`${jsPanel.id}-node`);
			let counter = 0;
			if (!Comp) return null;
			return (
				<CreatePortal rootNode={node} key={jsPanel.id}>
					{Array.isArray(Comp) ? (
						Comp.map(C => (
							<Suspense key={`${jsPanel.id}-${counter++}`} fallback={<div className="alert alert-info">Loading...</div>}>
								<C jsPanel={jsPanel} />
							</Suspense>
						))
					) : (
						<Suspense fallback={<div className="alert alert-info">Loading...</div>}>
							<Comp jsPanel={jsPanel} />
						</Suspense>
					)}
				</CreatePortal>
			);
		});
	}

	render() {
		const jsPanels = Object.keys(this.state.panels);
		const actionButtonProps = {
			className: 'btn btn-outline-primary ml-2 mb-2',
			handleClick: this.createJsPanel
		};
		return (
			<div className="container-fluid">
				<div className="row bg-dark text-white shadow p-2">
					<div className="col-md-12">
					</div>
				</div>
				<div className="row justify-content-center mt-4">
					<div className="card">
						<div className="card-body">
							<ActionButton {...actionButtonProps} title="panel" comp={() =>
								<Editor
									initialContent='console.log(4)'
								/>
							} />
						</div>
					</div>
				</div>
				{jsPanels.length > 0 && this.renderJsPanlesInsidePortal()}
			</div>
		);
	}
}

export default Panel;
