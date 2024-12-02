import "./Info.css";

import React from "react";
import ReactMarkdown from "react-markdown";

import { IonContent, IonPage } from "@ionic/react";

import readmeContent from "../../README.md?raw";
import Header from "../components/Header";

/**
 * To remove the Info page and README functionality:
 * 1. Delete this file (InfoPage.tsx) and its CSS (Info.css)
 * 2. Remove the Info tab from App.tsx:
 *    - Remove the InfoPage import
 *    - Remove the Info tab button (reference App.tsx lines 107-110)
 *    - Remove any associated routes
 * 4. Remove markdown-loader from vite.config.ts
 * 5. Remove react-markdown from package.json
 *
 * Note: This component displays the project's README.md content.
 * If you want to keep the Info tab but with different content,
 * replace the ReactMarkdown component with your desired content.
 */
const InfoPage: React.FC = () => {
  return (
    <IonPage>
      <Header title="Info" showBackButton={false} />
      <IonContent className="ion-padding">
        <div className="markdown-content">
          <ReactMarkdown>{readmeContent}</ReactMarkdown>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default InfoPage;
