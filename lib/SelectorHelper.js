
// @ts-check
const logger = require("./Logger")

/**
 * module to create sap.ui.test.RecordReplay.ControlSelector easier
 */
module.exports = {

    /**
     * Creates a selector with a binding path matcher
     *
     * @param viewName {String} (Recommended or "")
     * @param controlType {String} (Recommended or "")
     * @param propertyPath {String} part of bindingPath
     * @param modelName {String} (Optional or "") part of bindingPath
     * @param path {String} (Optional) part of bindingPath
     * @return selector {sap.ui.test.RecordReplay.ControlSelector}
     *
     * Since the string parameters are not clearly to identify the order must be kept for the call and in case for not used parameters the parameter must be set to empty string
     */
    cerateBindingPathSelector: (viewName = "", controlType = "", modelName = "", propertyPath = "", path = "") => {
        let bindingPath = {}

        if ((path.length === 0) && (propertyPath.length === 0)) {
            // not valid to crate without too less parameters
            const error = "tried to create Binding path selector without path and propertyPath parameters";
            logger.error(error)
            return error;
        }

        // check waht needs to be created
        modelName && (typeof modelName === 'string') && (modelName.length > 0) ? bindingPath.modelName = modelName : false;
        path && (typeof path === 'string') && (path.length > 0) ? bindingPath.path = path : false;
        propertyPath && (typeof propertyPath === 'string') && (propertyPath.length > 0) ? bindingPath.propertyPath = propertyPath : false;

        // construct the selector
        let selector = {
            bindingPath: bindingPath
        }

        // add properties: viewName and controlType if givven
        viewName && (typeof viewName === 'string') && (viewName.length > 0) ? selector.viewName = viewName : false;
        controlType && (typeof controlType === 'string') && (controlType.length > 0) ? selector.controlType = controlType : false;

        return selector
    },

    /**
     * TODO: add support for multiple properties
     */
    createPropertyMatchSelector: (viewName = "", controlType = "", propertyKey = "", propertyName = "") => {
        let properties = {}

        if ((propertyKey.length === 0) || propertyName.length === 0) {
            // not valid to crate without too less parameters
            const error = "tried to create properties selector without property key or name";
            logger.error(error)
            return error;
        }

        // check waht needs to be created
        // TODO: need to do some validation here?
        properties[propertyKey] = propertyName;

        let selector = {
            properties: properties
        }

        // add properties: viewName and controlType if givven
        viewName && (typeof viewName === 'string') && (viewName.length > 0) ? selector.viewName = viewName : false;
        controlType && (typeof controlType === 'string') && (controlType.length > 0) ? selector.controlType = controlType : false;

        return selector;

    }
}
