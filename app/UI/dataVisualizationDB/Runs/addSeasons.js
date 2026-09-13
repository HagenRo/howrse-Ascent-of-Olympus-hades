"use strict";

const STORAGE_KEY = "addSeasonDraft";
const ADD_SEASON_BUTTON_ID = "addSeasonButton";

const FIELD_DEFINITIONS = [
    {
        name: "mainGodAltName",
        label: "alt Name",
        type: "text",
        required: true
    },
    {
        name: "mainGodDisplayName",
        label: "Anzeigename",
        type: "text",
        required: false
    },
    {
        name: "godRarity",
        label: "Seltenheit",
        type: "select",
        required: true,
        options: [
            { value: "devine", label: "devine" },
            { value: "precious", label: "precious" },
            { value: "rare", label: "rare" },
            { value: "common", label: "common" }
        ]
    },
    {
        name: "seasonStartDate",
        label: "Startdatum",
        type: "date",
        required: true
    },
    {
        name: "seasonStartTime",
        label: "Startzeit",
        type: "time",
        required: true,
        defaultValue: "14:00"
    },
    {
        name: "seasonEndDate",
        label: "Enddatum",
        type: "date",
        required: false
    }, {
        name: "seasonEndTime",
        label: "Endzeit",
        type: "time",
        required: false,
        defaultValue: "14:00"
    }
];

const HORSE_FIELD_DEFINITIONS = [
    {
        name: "horseAltName",
        label: "alt Name",
        type: "text",
        required: true
    },
    {
        name: "horseDisplayName",
        label: "Anzeigename",
        type: "text",
        required: false
    },
    {
        name: "horseRarity",
        label: "Seltenheit",
        type: "select",
        required: true,
        options: [
            { value: "devine", label: "devine" },
            { value: "precious", label: "precious" },
            { value: "rare", label: "rare" },
            { value: "common", label: "common" }
        ]
    }
];

class SeasonDraftStore {
    constructor(storage = window.localStorage, key = STORAGE_KEY) {
        this.storage = storage;
        this.key = key;
    }

    save(data) {
        try {
            this.storage.setItem(this.key, JSON.stringify(data));
        } catch (error) {
            console.error(
                "Der Saisonentwurf konnte nicht gespeichert werden.",
                error
            );
        }
    }

    load() {
        try {
            const storedDraft = this.storage.getItem(this.key);

            if (!storedDraft) {
                return null;
            }

            const draft = JSON.parse(storedDraft);

            return draft && typeof draft === "object"
                ? draft
                : null;
        } catch (error) {
            console.error(
                "Der gespeicherte Saisonentwurf konnte nicht gelesen werden.",
                error
            );

            this.remove();

            return null;
        }
    }

    remove() {
        try {
            this.storage.removeItem(this.key);
        } catch (error) {
            console.error(
                "Der Saisonentwurf konnte nicht gelöscht werden.",
                error
            );
        }
    }
}

class SeasonValidator {
    validate(data, fields) {
        const firstEmptyField = fields.find((field) => {
            return field.required && !data[field.name];
        });

        if (firstEmptyField) {
            return {
                valid: false,
                message: "Bitte fülle alle Pflichtfelder aus.",
                fieldName: firstEmptyField.name
            };
        }

        if (
            data.seasonStartDate &&
            data.seasonEndDate &&
            data.seasonEndDate < data.seasonStartDate
        ) {
            return {
                valid: false,
                message: "Das Enddatum darf nicht vor dem Startdatum liegen.",
                fieldName: "seasonEndDate"
            };
        }

        return {
            valid: true,
            message: "",
            fieldName: null
        };
    }
}

class SeasonFactory {
    create(data) {
        if (typeof globalThis.Seasons === "function") {
            return new globalThis.Seasons(data);
        }

        return {
            ...data,
            startDate: data.seasonStartDate,
            endDate: data.seasonEndDate
        };
    }
}

class SeasonModal {
    constructor({
        draftStore = new SeasonDraftStore(),
        validator = new SeasonValidator(),
        seasonFactory = new SeasonFactory(),
        fields = FIELD_DEFINITIONS,
        horseFields = HORSE_FIELD_DEFINITIONS
    } = {}) {
        this.draftStore = draftStore;
        this.validator = validator;
        this.seasonFactory = seasonFactory;
        this.fields = fields;
        this.horseFields = horseFields;

        this.overlay = null;
        this.form = null;
        this.errorElement = null;
        this.previousActiveElement = null;
    }

    open() {
        this.create();

        this.previousActiveElement = document.activeElement;

        this.restoreDraft();
        this.hideError();

        this.overlay.hidden = false;
        this.overlay.style.display = "flex";

        document.body.style.overflow = "hidden";

        this.focusFirstField();
    }


    close({ saveDraft = true } = {}) {
        if (!this.overlay) {
            return;
        }

        if (saveDraft) {
            this.saveDraft();
        }

        this.overlay.hidden = true;
        this.overlay.style.display = "none";

        document.body.style.overflow = "";

        this.restorePreviousFocus();
    }


    destroy() {
        if (!this.overlay) {
            return;
        }

        this.overlay.remove();

        this.overlay = null;
        this.form = null;
        this.errorElement = null;
    }

    create() {
        if (this.overlay) {
            return;
        }

        this.overlay = document.createElement("div");
        this.overlay.className = "add-season-overlay";
        this.overlay.hidden = true;

        this.overlay.setAttribute("role", "dialog");
        this.overlay.setAttribute("aria-modal", "true");
        this.overlay.setAttribute(
            "aria-labelledby",
            "addSeasonModalTitle"
        );

        this.overlay.innerHTML = this.createModalMarkup();

        document.body.appendChild(this.overlay);

        this.form = this.overlay.querySelector("#addSeasonForm");
        this.errorElement = this.overlay.querySelector("#addSeasonError");

        this.registerEvents();
    }

    registerEvents() {
        this.overlay
            .querySelector("#addSeasonCloseButton")
            .addEventListener("click", () => {
                this.close();
            });

        this.overlay
            .querySelector("#addSeasonCancelButton")
            .addEventListener("click", () => {
                this.close();
            });

        this.overlay.addEventListener("click", (event) => {
            if (event.target === this.overlay) {
                this.close();
            }
        });

        this.form.addEventListener("input", () => {
            this.saveDraft();
        });

        this.form.addEventListener("change", () => {
            this.saveDraft();
        });

        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.saveSeason();
        });
    }

    saveSeason() {
        const data = this.getFormData();

        const validationResult = this.validator.validate(
            data,
            this.getAllFields()
        );

        if (!validationResult.valid) {
            this.showError(validationResult.message);
            this.focusField(validationResult.fieldName);

            return;
        }

        let season = new Season(data);

        globalThis.createdSeason = season;

        this.draftStore.remove();

        this.close({ saveDraft: false });
        this.destroy();

        chrome.runtime.sendMessage({ mdText: "addSeasonToDB", season: { ...season } }, (response) => {
            console.log(response);
        });

        console.log("Neue Saison gespeichert:", season);
    }

    getFormData() {
        const data = {};

        this.getAllFields().forEach((field) => {
            const input = this.form.elements[field.name];

            data[field.name] = input
                ? input.value.trim()
                : "";
        });

        return data;
    }

    saveDraft() {
        if (!this.form) {
            return;
        }

        this.draftStore.save(this.getFormData());
    }

    restoreDraft() {
        const draft = this.draftStore.load();

        if (!draft || !this.form) {
            return;
        }

        this.getAllFields().forEach((field) => {
            const input = this.form.elements[field.name];

            if (
                input &&
                Object.prototype.hasOwnProperty.call(
                    draft,
                    field.name
                )
            ) {
                input.value = draft[field.name] ?? "";
            }
        });
    }

    getAllFields() {
        return [
            ...this.fields,
            ...this.getHorseFields()
        ];
    }

    getHorseFields() {
        const fields = [];

        for (let horseNumber = 1; horseNumber <= 4; horseNumber += 1) {
            this.horseFields.forEach((field) => {
                fields.push({
                    ...field,
                    name: `${field.name}${horseNumber}`
                });
            });
        }

        return fields;
    }

    createModalMarkup() {
        return `
            <div class="add-season-modal">
                <div class="add-season-modal-header">
                    <h2
                        id="addSeasonModalTitle"
                        class="add-season-modal-title">
                        Neue Saison hinzufügen
                    </h2>

                    <button
                        type="button"
                        class="add-season-modal-close"
                        id="addSeasonCloseButton"
                        aria-label="Popup schließen">
                        &times;
                    </button>
                </div>

                <form
                    id="addSeasonForm"
                    class="add-season-modal-body">

                    <div
                        id="addSeasonError"
                        class="add-season-error"
                        role="alert"
                        aria-live="assertive">
                    </div>

                    <section class="add-season-section">
                        <h3 class="add-season-section-title">
                            Saison und Hauptgott
                        </h3>

                        <div class="add-season-grid">
                            ${this.fields
                .map((field) => {
                    return this.createFieldMarkup(field);
                })
                .join("")}
                        </div>
                    </section>

                    <section class="add-season-section">
                        <h3 class="add-season-section-title">
                            Pferde
                        </h3>

                        <div class="add-season-grid-horses">
                            ${this.createAllHorseRowsMarkup()}
                        </div>
                    </section>

                    <div class="add-season-modal-footer">
                        <button
                            type="button"
                            id="addSeasonCancelButton"
                            class="add-season-button add-season-button-cancel">
                            Abbrechen
                        </button>

                        <button
                            type="submit"
                            class="add-season-button add-season-button-save">
                            Saison speichern
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    createAllHorseRowsMarkup() {
        return Array.from(
            { length: 4 },
            (_, index) => this.createHorseRowMarkup(index + 1)
        ).join("");
    }

    createHorseRowMarkup(horseNumber) {
        const horseFields = this.horseFields.map((field) => {
            return {
                ...field,
                name: `${field.name}${horseNumber}`
            };
        });

        return `
            <div class="add-season-horse-row">
                <div class="add-season-horse-title">
                    Pferd ${horseNumber}
                </div>

                ${horseFields
                .map((field) => this.createFieldMarkup(field))
                .join("")}
            </div>
        `;
    }

    createFieldMarkup(field) {
        const inputId = `addSeason_${field.name}`;

        return `
            <div class="add-season-field">
                <label for="${this.escapeHtml(inputId)}">
                    ${this.escapeHtml(field.label)}
                </label>

                ${this.createInputMarkup(field, inputId)}
            </div>
        `;
    }

    createInputMarkup(field, inputId) {
        const requiredAttribute = field.required
            ? "required"
            : "";

        if (field.type === "select") {
            const options = field.options
                .map((option, index) => {
                    const selected = index === 0
                        ? "selected"
                        : "";

                    return `
                        <option
                            value="${this.escapeHtml(option.value)}"
                            ${selected}>
                            ${this.escapeHtml(option.label)}
                        </option>
                    `;
                })
                .join("");

            return `
                <select
                    id="${this.escapeHtml(inputId)}"
                    name="${this.escapeHtml(field.name)}"
                    ${requiredAttribute}>
                    ${options}
                </select>
            `;
        }

        const valueAttribute = field.defaultValue
            ? `value="${this.escapeHtml(field.defaultValue)}"`
            : "";

        return `
            <input
                id="${this.escapeHtml(inputId)}"
                name="${this.escapeHtml(field.name)}"
                type="${this.escapeHtml(field.type)}"
                ${requiredAttribute}
                ${valueAttribute}
                autocomplete="off">
        `;

    }

    showError(message) {
        if (!this.errorElement) {
            return;
        }

        this.errorElement.textContent = message;
        this.errorElement.classList.add(
            "add-season-error-visible"
        );
    }

    hideError() {
        if (!this.errorElement) {
            return;
        }

        this.errorElement.textContent = "";
        this.errorElement.classList.remove(
            "add-season-error-visible"
        );
    }

    focusFirstField() {
        const firstField = this.form?.querySelector(
            "input, select, textarea"
        );

        if (firstField) {
            window.setTimeout(() => {
                firstField.focus();
            }, 0);
        }
    }

    focusField(fieldName) {
        if (!fieldName || !this.form) {
            return;
        }

        const field = this.form.elements[fieldName];

        if (field) {
            field.focus();
        }
    }

    restorePreviousFocus() {
        if (
            this.previousActiveElement &&
            typeof this.previousActiveElement.focus === "function"
        ) {
            this.previousActiveElement.focus();
        }
    }

    escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }
}

class SeasonModalController {
    constructor(buttonId = ADD_SEASON_BUTTON_ID) {
        this.buttonId = buttonId;
        this.modal = new SeasonModal();
    }

    initialize() {
        const button = document.getElementById(this.buttonId);

        if (!button) {
            console.error(
                `Der Button #${this.buttonId} wurde nicht gefunden.`
            );

            return;
        }

        button.addEventListener("click", () => {
            this.modal.open();
        });

        document.addEventListener("keydown", (event) => {
            if (
                event.key === "Escape" &&
                this.modal.overlay &&
                !this.modal.overlay.hidden
            ) {
                this.modal.close();
            }
        });
    }
}

function initializeAddSeason() {
    const controller = new SeasonModalController();
    controller.initialize();
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeAddSeason
    );
} else {
    initializeAddSeason();
}
