import MainPage, {PageAlignmentEnum} from "@/app/components/mainPage";

export default function Page() {

    return (
        <MainPage title={"Rechercher"} pageAlignment={PageAlignmentEnum.center}>
            <p>Recherche</p>
        </MainPage>
    );
}