import { useContext, useEffect, useState } from "react";
import { MyAccountContext } from "../../configs/MyContext";
import APIs, { endpoints } from "../../configs/APIs";
import { Text, View } from "react-native";

const Surveys = () => {
    const accountState = useContext(MyAccountContext);
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadSurveys = async () => {
        try {
            setLoading(true);
            let res = await APIs.get(endpoints['surveys'](accountState));
            setSurveys(res.data);
        } catch (error) {
            console.error("ERROR: ", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        loadSurveys();
    },[]);

    return(
            <View>
                <Text>Khảo sát</Text>
            </View>
        );
}

export default Surveys;