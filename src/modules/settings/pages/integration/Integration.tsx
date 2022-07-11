import Button from 'common/button';
import React, { useState } from 'react';
import unsplashIcon from '../../../../assets/images/unsplash.svg';
import slackIcon from '../../../../assets/images/slack.svg';

const Integration: React.FC<{hidden:boolean}> = ({ hidden }) => {
    
    const [isButtonConnect, setisButtonConnect] = useState<boolean>(true);
    const connectedBtnClassName="bg-connectButton shadow-contactCard font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient";
    const disConnectedBtnClassName="btn-disconnect-gradient shadow-contactCard font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300";

    return (
        <div className="settings-integration container mt-2.62 pb-20">
            <h3 className="font-Poppins text-infoBlack font-semibold text-base leading-1.43">Connected Integrations</h3>
            <div className="flex mt-1.8 flex-wrap w-full pb-1.68 border-b border-bottom-card">
                <div className="app-input-card-border shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center mr-5">
                    <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                        <img src={unsplashIcon} alt="" className="h-2.31" />
                    </div>
                    <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">Khoros</div>
                    <Button
                        type="button"
                        text={isButtonConnect ? 'Disconnect' :'Connect'}
                        className={isButtonConnect ? disConnectedBtnClassName : connectedBtnClassName}
                    />
                </div>
                <div className="app-input-card-border shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center mr-5">
                    <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                        <img src={slackIcon} alt="" className="h-2.31" />
                    </div>
                    <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">HIgher Logi</div>
                    <Button
                        type="button"
                        text="Disconnect"
                        className={isButtonConnect ? disConnectedBtnClassName : connectedBtnClassName}
                    />
                </div>
            </div>
            <div className="pending-connect mt-1.8">
                <h3 className="font-Poppins text-infoBlack font-semibold text-base leading-1.43">Integrations</h3>
                <p className="font-Poppins font-normal text-error leading-1.43 mt-0.5">
                    Choose from any of the following data sources to connect with and see what your community members are up to!
                </p>
                <div className="flex mt-1.8 flex-wrap w-full">
                    <div className="app-input-card-border shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center mr-5">
                        <div className="flex flex-wrap items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                            <img src={unsplashIcon} alt="" className="h-2.31" />
                        </div>
                        <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">Khoros</div>
                        <Button
                            type="button"
                            text="Connect"
                            className={!isButtonConnect ? disConnectedBtnClassName : connectedBtnClassName}
                        />
                    </div>
                    <div className="app-input-card-border shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center mr-5">
                        <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                            <img src={unsplashIcon} alt="" className="h-2.31" />
                        </div>
                        <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">Khoros</div>
                        <Button
                            type="button"
                            text="Connect"
                            className={!isButtonConnect ? disConnectedBtnClassName : connectedBtnClassName}
                        />
                    </div>
                    <div className="app-input-card-border shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center mr-5">
                        <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                            <img src={unsplashIcon} alt="" className="h-2.31" />
                        </div>
                        <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">Khoros</div>
                        <Button
                            type="button"
                            text="Connect"
                            className="bg-black shadow-contactCard font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded-full h-6 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 "
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Integration;
