/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Button, Grid, Icon, Input, Label, Popup } from "semantic-ui-react";
import { Hint } from "../typography";

export interface URLInputPropsInterface extends TestableComponentInterface {
    addURLTooltip?: string;
    duplicateURLErrorMessage: string;
    urlState: string;
    setURLState: any;
    placeholder?: string;
    labelName: string;
    computerWidth?: number;
    validation: (value?) => boolean;
    validationErrorMsg: string;
    value?: string;
    hint?: string;
    showError?: boolean;
    setShowError?: any;
    required?: boolean;
    disabled?: boolean;
    hideComponent?: boolean;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 * URL Input component.
 *
 * @param {URLInputPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const URLInput: FunctionComponent<URLInputPropsInterface> = (
    props: URLInputPropsInterface
): ReactElement => {

    const {
        addURLTooltip,
        duplicateURLErrorMessage,
        showError,
        setShowError,
        urlState,
        setURLState,
        validation,
        validationErrorMsg,
        placeholder,
        labelName,
        value,
        hint,
        required,
        disabled,
        hideComponent,
        computerWidth,
        readOnly,
        [ "data-testid" ]: testId
    } = props;

    const [changeUrl, setChangeUrl] = useState<string>("");
    const [predictValue, setPredictValue] = useState<string[]>([]);
    const [validURL, setValidURL] = useState<boolean>(true);
    const [duplicateURL, setDuplicateURL] = useState<boolean>(false);
    const [keepFocus, setKeepFocus] = useState<boolean>(false);
    const [hideEntireComponent, setHideEntireComponent] = useState<boolean>(false);

    /**
     * Add URL to the URL list.
     */
    const addUrl = () => {
        const url = changeUrl;
        const urlValid = validation(url);
        setValidURL(urlValid);
        if (urlState === "" || urlState === undefined) {
            setURLState(url);
            setChangeUrl("");
        } else {
            const availableURls = urlState.split(",");
            const duplicate = availableURls.includes(url);
            setDuplicateURL(duplicate);
            if (urlValid && !duplicate) {
                setURLState((url + "," + urlState));
                setChangeUrl("");
            }
        }
    };

    /**
     * Initial prediction for the URL.
     * @param changeValue input by the user.
     */
    const getPredictions = (changeValue) => {

        return [
            "https://",
            "http://"
        ].filter((item) => item.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1);
    };

    /**
     * Enter button option.
     * @param e keypress event.
     */
    const keyPressed = (e) => {
        const key = e.which || e.charCode || e.keyCode;
        if (key === 13) {
            e.preventDefault();
            addUrl();
        }
    };

    /**
     * Handle change event of the input.
     *
     * @param event change event.
     */
    const handleChange = (event) => {
        const changeValue = event.target.value;
        let predictions = [];
        if (changeValue.length > 0) {
            predictions = getPredictions(changeValue);
        }
        if (!validURL) {
            setValidURL(true);
        }
        setKeepFocus(true);
        setPredictValue(predictions);
        setChangeUrl(changeValue);
    };

    /**
     * Handle blur event.
     */
    const handleOnBlur = () => {
        // TODO introduce a different method to handle this
        // if (!isEmpty(changeUrl)) {
        //     addUrl();
        // }
        setKeepFocus(false);
    };

    /**
     * When the predicted element is clicked select the predict.
     * @param predict filter prediction.
     */
    const onPredictClick = (predict: string) => {
        setChangeUrl(predict);
        setPredictValue([]);
    };

    const addFromButton = (e) => {
        e.preventDefault();
        addUrl();
    };

    /**
     * Remove the URL from the listed URLS.
     * @param removeURL URL to be removed.
     */
    const removeValue = (removeURL) => {
        let urlsAfterRemoved = urlState;
        if (urlState.split(",").length > 1) {
            urlsAfterRemoved = urlsAfterRemoved.split(removeURL + ",").join("");
        } else {
            urlsAfterRemoved = "";
        }
        setURLState(urlsAfterRemoved);
    };

    useEffect(() => {
        setURLState(value);
    }, [value]);

    useEffect(() => {
        if (showError) {
            setValidURL(false);
            setShowError(false);
        }
    }, [showError]);

    useEffect(() => {
            if (hideComponent) {
                setHideEntireComponent(hideComponent);
            }
        }, [hideComponent]
    );

    const computerSize: any = (computerWidth) ? computerWidth : 8;

    return (!hideEntireComponent &&
        <>
            <Grid.Row columns={ 1 } className={ "urlComponentLabelRow" }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ computerSize }>
                    {
                        required ? (
                            <div className={ "required field" }>
                                <label>{ labelName }</label>
                            </div>
                        ) : (
                            <label>{ labelName }</label>
                        )
                    }
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={ "urlComponentInputRow" }>
                <Grid.Column mobile={ 14 } tablet={ 14 } computer={ computerSize }>
                    <Input
                        fluid
                        error={ !(validURL && !duplicateURL) }
                        focus={ keepFocus }
                        value={ changeUrl }
                        onKeyDown={ keyPressed }
                        onChange={ handleChange }
                        onBlur={ handleOnBlur }
                        placeholder={ placeholder }
                        action
                        readOnly={ readOnly }
                        data-testid={ testId }
                    >
                        <input
                            disabled={ disabled ? disabled : false }
                        />
                        <Popup
                            disabled={ readOnly }
                            trigger={
                                (
                                    <Button
                                        onClick={ (e) => addFromButton(e) }
                                        icon="add"
                                        type="button"
                                        disabled={ readOnly || disabled }
                                        data-testid={ `${ testId }-add-button` }
                                    />
                                )
                            }
                            position="top center"
                            content={ addURLTooltip }
                            inverted
                        />
                    </Input>
                    {
                        !validURL &&
                        (
                            <Label basic color="red" pointing>
                                { validationErrorMsg }
                            </Label>
                        )
                    }
                    {
                        duplicateURL &&
                        (
                            <Label basic color="red" pointing>
                                { duplicateURLErrorMessage }
                            </Label>
                        )
                    }
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={ "urlComponentInputRow" }>
                <Grid.Column mobile={ 14 } tablet={ 14 } computer={ computerSize }>
                    {
                        (predictValue.length > 0) &&
                        predictValue.map((predict) => {
                            return (
                                <Label
                                    key={ predict }
                                    basic
                                    color="grey"
                                    onClick={ () => onPredictClick(predict) }
                                >
                                    { predict }
                                </Label>
                            );
                        })
                    }
                </Grid.Column>
            </Grid.Row>
            { urlState && urlState.split(",").map((url) => {
                if (url !== "") {
                    return (
                        <Grid.Row key={ url } className={ "urlComponentTagRow" }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ computerSize }>
                                <Label data-testid={ `${ testId }-${ url }` }>
                                    { url }
                                    {
                                        !readOnly && (
                                            <Icon
                                                name="delete"
                                                onClick={ () => removeValue(url) }
                                                data-testid={ `${ testId }-${ url }-delete-button` }
                                            />
                                        )
                                    }
                                </Label>
                            </Grid.Column>
                        </Grid.Row>
                    );
                }
            }) }
            { hint && (
                <Grid.Row className={ "urlComponentTagRow" }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ computerSize }>
                        <Hint>
                            { hint }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
            ) }
        </>
    );
};

/**
 * Default props for the URL input component.
 */
URLInput.defaultProps = {
    addURLTooltip: "Add a URL",
    "data-testid": "url-input",
    duplicateURLErrorMessage: "This URL is already added. Please select a different one."
};
