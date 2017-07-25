/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CommonModule } from '@angular/common';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, Directive, ElementRef, Input, IterableDiffers, NgModule, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation, isDevMode } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { merge } from 'rxjs/observable/merge';
import { takeUntil } from 'rxjs/operator/takeUntil';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/**
 * The row template that can be used by the md-table. Should not be used outside of the
 * material library.
 */
const CDK_ROW_TEMPLATE = `<ng-container cdkCellOutlet></ng-container>`;
/**
 * Base class for the CdkHeaderRowDef and CdkRowDef that handles checking their columns inputs
 * for changes and notifying the table.
 * @abstract
 */
class BaseRowDef {
    /**
     * @param {?} template
     * @param {?} _differs
     */
    constructor(template, _differs) {
        this.template = template;
        this._differs = _differs;
        /**
         * Event stream that emits when changes are made to the columns.
         */
        this.columnsChange = new Subject();
        this.viewInitialized = false;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.viewInitialized = true;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        // Create a new columns differ if one does not yet exist. Initialize it based on initial value
        // of the columns property.
        if (!this._columnsDiffer && changes['columns'].currentValue) {
            this._columnsDiffer = this._differs.find(changes['columns'].currentValue).create();
        }
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        if (!this.viewInitialized || !this._columnsDiffer || !this.columns) {
            return;
        }
        // Notify the table if there are any changes to the columns.
        const /** @type {?} */ changes = this._columnsDiffer.diff(this.columns);
        if (changes) {
            this.columnsChange.next();
        }
    }
}
/**
 * Header row definition for the CDK table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
class CdkHeaderRowDef extends BaseRowDef {
    /**
     * @param {?} template
     * @param {?} _differs
     */
    constructor(template, _differs) {
        super(template, _differs);
    }
}
CdkHeaderRowDef.decorators = [
    { type: Directive, args: [{
                selector: '[cdkHeaderRowDef]',
                inputs: ['columns: cdkHeaderRowDef'],
            },] },
];
/**
 * @nocollapse
 */
CdkHeaderRowDef.ctorParameters = () => [
    { type: TemplateRef, },
    { type: IterableDiffers, },
];
/**
 * Data row definition for the CDK table.
 * Captures the header row's template and other row properties such as the columns to display.
 */
class CdkRowDef extends BaseRowDef {
    /**
     * @param {?} template
     * @param {?} _differs
     */
    constructor(template, _differs) {
        super(template, _differs);
    }
}
CdkRowDef.decorators = [
    { type: Directive, args: [{
                selector: '[cdkRowDef]',
                inputs: ['columns: cdkRowDefColumns'],
            },] },
];
/**
 * @nocollapse
 */
CdkRowDef.ctorParameters = () => [
    { type: TemplateRef, },
    { type: IterableDiffers, },
];
/**
 * Outlet for rendering cells inside of a row or header row.
 * \@docs-private
 */
class CdkCellOutlet {
    /**
     * @param {?} _viewContainer
     */
    constructor(_viewContainer) {
        this._viewContainer = _viewContainer;
        CdkCellOutlet.mostRecentCellOutlet = this;
    }
}
CdkCellOutlet.decorators = [
    { type: Directive, args: [{ selector: '[cdkCellOutlet]' },] },
];
/**
 * @nocollapse
 */
CdkCellOutlet.ctorParameters = () => [
    { type: ViewContainerRef, },
];
/**
 * Header template container that contains the cell outlet. Adds the right class and role.
 */
class CdkHeaderRow {
}
CdkHeaderRow.decorators = [
    { type: Component, args: [{
                selector: 'cdk-header-row',
                template: CDK_ROW_TEMPLATE,
                host: {
                    'class': 'cdk-header-row',
                    'role': 'row',
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
CdkHeaderRow.ctorParameters = () => [];
/**
 * Data row template container that contains the cell outlet. Adds the right class and role.
 */
class CdkRow {
}
CdkRow.decorators = [
    { type: Component, args: [{
                selector: 'cdk-row',
                template: CDK_ROW_TEMPLATE,
                host: {
                    'class': 'cdk-row',
                    'role': 'row',
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
CdkRow.ctorParameters = () => [];

/**
 * Cell definition for a CDK table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
class CdkCellDef {
    /**
     * @param {?} template
     */
    constructor(template) {
        this.template = template;
    }
}
CdkCellDef.decorators = [
    { type: Directive, args: [{ selector: '[cdkCellDef]' },] },
];
/**
 * @nocollapse
 */
CdkCellDef.ctorParameters = () => [
    { type: TemplateRef, },
];
/**
 * Header cell definition for a CDK table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
class CdkHeaderCellDef {
    /**
     * @param {?} template
     */
    constructor(template) {
        this.template = template;
    }
}
CdkHeaderCellDef.decorators = [
    { type: Directive, args: [{ selector: '[cdkHeaderCellDef]' },] },
];
/**
 * @nocollapse
 */
CdkHeaderCellDef.ctorParameters = () => [
    { type: TemplateRef, },
];
/**
 * Column definition for the CDK table.
 * Defines a set of cells available for a table column.
 */
class CdkColumnDef {
}
CdkColumnDef.decorators = [
    { type: Directive, args: [{ selector: '[cdkColumnDef]' },] },
];
/**
 * @nocollapse
 */
CdkColumnDef.ctorParameters = () => [];
CdkColumnDef.propDecorators = {
    'name': [{ type: Input, args: ['cdkColumnDef',] },],
    'cell': [{ type: ContentChild, args: [CdkCellDef,] },],
    'headerCell': [{ type: ContentChild, args: [CdkHeaderCellDef,] },],
};
/**
 * Header cell template container that adds the right classes and role.
 */
class CdkHeaderCell {
    /**
     * @param {?} columnDef
     * @param {?} elementRef
     * @param {?} renderer
     */
    constructor(columnDef, elementRef, renderer) {
        renderer.addClass(elementRef.nativeElement, `cdk-column-${columnDef.name}`);
    }
}
CdkHeaderCell.decorators = [
    { type: Directive, args: [{
                selector: 'cdk-header-cell',
                host: {
                    'class': 'cdk-header-cell',
                    'role': 'columnheader',
                },
            },] },
];
/**
 * @nocollapse
 */
CdkHeaderCell.ctorParameters = () => [
    { type: CdkColumnDef, },
    { type: ElementRef, },
    { type: Renderer2, },
];
/**
 * Cell template container that adds the right classes and role.
 */
class CdkCell {
    /**
     * @param {?} columnDef
     * @param {?} elementRef
     * @param {?} renderer
     */
    constructor(columnDef, elementRef, renderer) {
        renderer.addClass(elementRef.nativeElement, `cdk-column-${columnDef.name}`);
    }
}
CdkCell.decorators = [
    { type: Directive, args: [{
                selector: 'cdk-cell',
                host: {
                    'class': 'cdk-cell',
                    'role': 'gridcell',
                },
            },] },
];
/**
 * @nocollapse
 */
CdkCell.ctorParameters = () => [
    { type: CdkColumnDef, },
    { type: ElementRef, },
    { type: Renderer2, },
];

/**
 * Returns an error to be thrown when attempting to find an unexisting column.
 * \@docs-private
 * @param {?} id Id whose lookup failed.
 * @return {?}
 */
function getTableUnknownColumnError(id) {
    return new Error(`cdk-table: Could not find column with id "${id}".`);
}
/**
 * Provides a handle for the table to grab the view container's ng-container to insert data rows.
 * \@docs-private
 */
class RowPlaceholder {
    /**
     * @param {?} viewContainer
     */
    constructor(viewContainer) {
        this.viewContainer = viewContainer;
    }
}
RowPlaceholder.decorators = [
    { type: Directive, args: [{ selector: '[rowPlaceholder]' },] },
];
/**
 * @nocollapse
 */
RowPlaceholder.ctorParameters = () => [
    { type: ViewContainerRef, },
];
/**
 * Provides a handle for the table to grab the view container's ng-container to insert the header.
 * \@docs-private
 */
class HeaderRowPlaceholder {
    /**
     * @param {?} viewContainer
     */
    constructor(viewContainer) {
        this.viewContainer = viewContainer;
    }
}
HeaderRowPlaceholder.decorators = [
    { type: Directive, args: [{ selector: '[headerRowPlaceholder]' },] },
];
/**
 * @nocollapse
 */
HeaderRowPlaceholder.ctorParameters = () => [
    { type: ViewContainerRef, },
];
/**
 * The table template that can be used by the md-table. Should not be used outside of the
 * material library.
 */
const CDK_TABLE_TEMPLATE = `
  <ng-container headerRowPlaceholder></ng-container>
  <ng-container rowPlaceholder></ng-container>`;
/**
 * A data table that connects with a data source to retrieve data of type `T` and renders
 * a header row and data rows. Updates the rows when new data is provided by the data source.
 */
class CdkTable {
    /**
     * @param {?} _differs
     * @param {?} _changeDetectorRef
     * @param {?} elementRef
     * @param {?} renderer
     * @param {?} role
     */
    constructor(_differs, _changeDetectorRef, elementRef, renderer, role) {
        this._differs = _differs;
        this._changeDetectorRef = _changeDetectorRef;
        /**
         * Subject that emits when the component has been destroyed.
         */
        this._onDestroy = new Subject();
        /**
         * Flag set to true after the component has been initialized.
         */
        this._isViewInitialized = false;
        /**
         * Latest data provided by the data source through the connect interface.
         */
        this._data = [];
        /**
         * Map of all the user's defined columns identified by name.
         * Contains the header and data-cell templates.
         */
        this._columnDefinitionsByName = new Map();
        /**
         * Stream containing the latest information on the range of rows being displayed on screen.
         * Can be used by the data source to as a heuristic of what data should be provided.
         */
        this.viewChange = new BehaviorSubject({ start: 0, end: Number.MAX_VALUE });
        if (!role) {
            renderer.setAttribute(elementRef.nativeElement, 'role', 'grid');
        }
    }
    /**
     * Tracking function that will be used to check the differences in data changes. Used similarly
     * to `ngFor` `trackBy` function. Optimize row operations by identifying a row based on its data
     * relative to the function to know if a row should be added/removed/moved.
     * Accepts a function that takes two parameters, `index` and `item`.
     * @param {?} fn
     * @return {?}
     */
    set trackBy(fn) {
        if (isDevMode() &&
            fn != null && typeof fn !== 'function' && (console) && (console.warn)) {
            console.warn(`trackBy must be a function, but received ${JSON.stringify(fn)}.`);
        }
        this._trackByFn = fn;
    }
    /**
     * @return {?}
     */
    get trackBy() { return this._trackByFn; }
    /**
     * Provides a stream containing the latest data array to render. Influenced by the table's
     * stream of view window (what rows are currently on screen).
     * @return {?}
     */
    get dataSource() { return this._dataSource; }
    /**
     * @param {?} dataSource
     * @return {?}
     */
    set dataSource(dataSource) {
        if (this._dataSource !== dataSource) {
            this._switchDataSource(dataSource);
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._rowPlaceholder.viewContainer.clear();
        this._headerRowPlaceholder.viewContainer.clear();
        this._onDestroy.next();
        this._onDestroy.complete();
        if (this.dataSource) {
            this.dataSource.disconnect(this);
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // TODO(andrewseguin): Setup a listener for scroll events
        //   and emit the calculated view to this.viewChange
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        // TODO(andrewseguin): Throw an error if two columns share the same name
        this._columnDefinitions.forEach(columnDef => {
            this._columnDefinitionsByName.set(columnDef.name, columnDef);
        });
        // Re-render the rows if any of their columns change.
        // TODO(andrewseguin): Determine how to only re-render the rows that have their columns changed.
        const /** @type {?} */ columnChangeEvents = this._rowDefinitions.map(rowDef => rowDef.columnsChange);
        takeUntil.call(merge(...columnChangeEvents), this._onDestroy).subscribe(() => {
            // Reset the data to an empty array so that renderRowChanges will re-render all new rows.
            this._rowPlaceholder.viewContainer.clear();
            this._dataDiffer.diff([]);
            this._renderRowChanges();
        });
        // Re-render the header row if the columns change
        takeUntil.call(this._headerDefinition.columnsChange, this._onDestroy).subscribe(() => {
            this._headerRowPlaceholder.viewContainer.clear();
            this._renderHeaderRow();
        });
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        // Find and construct an iterable differ that can be used to find the diff in an array.
        this._dataDiffer = this._differs.find([]).create(this._trackByFn);
        this._isViewInitialized = true;
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        if (this._isViewInitialized && this.dataSource && !this._renderChangeSubscription) {
            this._renderHeaderRow();
            if (this.dataSource && !this._renderChangeSubscription) {
                this._observeRenderChanges();
            }
        }
    }
    /**
     * Switch to the provided data source by resetting the data and unsubscribing from the current
     * render change subscription if one exists. If the data source is null, interpret this by
     * clearing the row placeholder. Otherwise start listening for new data.
     * @param {?} dataSource
     * @return {?}
     */
    _switchDataSource(dataSource) {
        this._data = [];
        if (this._dataSource) {
            this.dataSource.disconnect(this);
        }
        this._dataSource = dataSource;
        if (this._isViewInitialized) {
            if (this._renderChangeSubscription) {
                this._renderChangeSubscription.unsubscribe();
            }
            if (this._dataSource) {
                this._observeRenderChanges();
            }
            else {
                this._rowPlaceholder.viewContainer.clear();
            }
        }
    }
    /**
     * Set up a subscription for the data provided by the data source.
     * @return {?}
     */
    _observeRenderChanges() {
        this._renderChangeSubscription = takeUntil.call(this.dataSource.connect(this), this._onDestroy)
            .subscribe(data => {
            this._data = data;
            this._renderRowChanges();
        });
    }
    /**
     * Create the embedded view for the header template and place it in the header row view container.
     * @return {?}
     */
    _renderHeaderRow() {
        const /** @type {?} */ cells = this._getHeaderCellTemplatesForRow(this._headerDefinition);
        if (!cells.length) {
            return;
        }
        // TODO(andrewseguin): add some code to enforce that exactly
        //   one CdkCellOutlet was instantiated as a result
        //   of `createEmbeddedView`.
        this._headerRowPlaceholder.viewContainer
            .createEmbeddedView(this._headerDefinition.template, { cells });
        cells.forEach(cell => {
            CdkCellOutlet.mostRecentCellOutlet._viewContainer.createEmbeddedView(cell.template, {});
        });
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Check for changes made in the data and render each change (row added/removed/moved).
     * @return {?}
     */
    _renderRowChanges() {
        const /** @type {?} */ changes = this._dataDiffer.diff(this._data);
        if (!changes) {
            return;
        }
        const /** @type {?} */ viewContainer = this._rowPlaceholder.viewContainer;
        changes.forEachOperation((item, adjustedPreviousIndex, currentIndex) => {
            if (item.previousIndex == null) {
                this._insertRow(this._data[currentIndex], currentIndex);
            }
            else if (currentIndex == null) {
                viewContainer.remove(adjustedPreviousIndex);
            }
            else {
                const /** @type {?} */ view = viewContainer.get(adjustedPreviousIndex);
                viewContainer.move(/** @type {?} */ ((view)), currentIndex);
            }
        });
        this._updateRowContext();
    }
    /**
     * Create the embedded view for the data row template and place it in the correct index location
     * within the data row view container.
     * @param {?} rowData
     * @param {?} index
     * @return {?}
     */
    _insertRow(rowData, index) {
        // TODO(andrewseguin): Add when predicates to the row definitions
        //   to find the right template to used based on
        //   the data rather than choosing the first row definition.
        const /** @type {?} */ row = this._rowDefinitions.first;
        // Row context that will be provided to both the created embedded row view and its cells.
        const /** @type {?} */ context = { $implicit: rowData };
        // TODO(andrewseguin): add some code to enforce that exactly one
        //   CdkCellOutlet was instantiated as a result  of `createEmbeddedView`.
        this._rowPlaceholder.viewContainer.createEmbeddedView(row.template, context, index);
        // Insert empty cells if there is no data to improve rendering time.
        const /** @type {?} */ cells = rowData ? this._getCellTemplatesForRow(row) : [];
        cells.forEach(cell => {
            CdkCellOutlet.mostRecentCellOutlet._viewContainer.createEmbeddedView(cell.template, context);
        });
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Updates the context for each row to reflect any data changes that may have caused
     * rows to be added, removed, or moved. The view container contains the same context
     * that was provided to each of its cells.
     * @return {?}
     */
    _updateRowContext() {
        const /** @type {?} */ viewContainer = this._rowPlaceholder.viewContainer;
        for (let /** @type {?} */ index = 0, /** @type {?} */ count = viewContainer.length; index < count; index++) {
            const /** @type {?} */ viewRef = (viewContainer.get(index));
            viewRef.context.index = index;
            viewRef.context.count = count;
            viewRef.context.first = index === 0;
            viewRef.context.last = index === count - 1;
            viewRef.context.even = index % 2 === 0;
            viewRef.context.odd = !viewRef.context.even;
        }
    }
    /**
     * Returns the cell template definitions to insert into the header
     * as defined by its list of columns to display.
     * @param {?} headerDef
     * @return {?}
     */
    _getHeaderCellTemplatesForRow(headerDef) {
        if (!headerDef.columns) {
            return [];
        }
        return headerDef.columns.map(columnId => {
            const /** @type {?} */ column = this._columnDefinitionsByName.get(columnId);
            if (!column) {
                throw getTableUnknownColumnError(columnId);
            }
            return column.headerCell;
        });
    }
    /**
     * Returns the cell template definitions to insert in the provided row
     * as defined by its list of columns to display.
     * @param {?} rowDef
     * @return {?}
     */
    _getCellTemplatesForRow(rowDef) {
        if (!rowDef.columns) {
            return [];
        }
        return rowDef.columns.map(columnId => {
            const /** @type {?} */ column = this._columnDefinitionsByName.get(columnId);
            if (!column) {
                throw getTableUnknownColumnError(columnId);
            }
            return column.cell;
        });
    }
}
CdkTable.decorators = [
    { type: Component, args: [{
                selector: 'cdk-table',
                template: CDK_TABLE_TEMPLATE,
                host: {
                    'class': 'cdk-table',
                },
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
            },] },
];
/**
 * @nocollapse
 */
CdkTable.ctorParameters = () => [
    { type: IterableDiffers, },
    { type: ChangeDetectorRef, },
    { type: ElementRef, },
    { type: Renderer2, },
    { type: undefined, decorators: [{ type: Attribute, args: ['role',] },] },
];
CdkTable.propDecorators = {
    'trackBy': [{ type: Input },],
    'dataSource': [{ type: Input },],
    '_rowPlaceholder': [{ type: ViewChild, args: [RowPlaceholder,] },],
    '_headerRowPlaceholder': [{ type: ViewChild, args: [HeaderRowPlaceholder,] },],
    '_columnDefinitions': [{ type: ContentChildren, args: [CdkColumnDef,] },],
    '_headerDefinition': [{ type: ContentChild, args: [CdkHeaderRowDef,] },],
    '_rowDefinitions': [{ type: ContentChildren, args: [CdkRowDef,] },],
};

/**
 * @abstract
 */
class DataSource {
    /**
     * Connects a collection viewer (such as a data-table) to this data source.
     * @abstract
     * @param {?} collectionViewer The component that exposes a view over the data provided by this
     *     data source.
     * @return {?} Observable that emits a new value when the data changes.
     */
    connect(collectionViewer) { }
    /**
     * Disconnects a collection viewer (such as a data-table) from this data source. Can be used
     * to perform any clean-up or tear-down operations when a view is being destroyed.
     *
     * @abstract
     * @param {?} collectionViewer The component that exposes a view over the data provided by this
     *     data source.
     * @return {?}
     */
    disconnect(collectionViewer) { }
}

const EXPORTED_DECLARATIONS = [
    CdkTable,
    CdkRowDef,
    CdkCellDef,
    CdkCellOutlet,
    CdkHeaderCellDef,
    CdkColumnDef,
    CdkCell,
    CdkRow,
    CdkHeaderCell,
    CdkHeaderRow,
    CdkHeaderRowDef,
    RowPlaceholder,
    HeaderRowPlaceholder,
];
class CdkTableModule {
}
CdkTableModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [EXPORTED_DECLARATIONS],
                declarations: [EXPORTED_DECLARATIONS]
            },] },
];
/**
 * @nocollapse
 */
CdkTableModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { CdkTableModule, DataSource, getTableUnknownColumnError, RowPlaceholder, HeaderRowPlaceholder, CDK_TABLE_TEMPLATE, CdkTable, CdkCellDef, CdkHeaderCellDef, CdkColumnDef, CdkHeaderCell, CdkCell, CDK_ROW_TEMPLATE, BaseRowDef, CdkHeaderRowDef, CdkRowDef, CdkCellOutlet, CdkHeaderRow, CdkRow };
//# sourceMappingURL=table.js.map
