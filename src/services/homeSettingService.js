import { useDispatch, useSelector } from "react-redux";
import { useFirestore } from "../hooks/useFirestore";
import { db } from "../utils/firebase";
import { setHomeSettings } from "../store/features/homeSettingSlice/homeSettingSlice";

const collectionName = "homeSettingService";
const PAGE_SIZE = 10;
const ORDER_FIELD = "createdAt";
const TIME_EXPIRATION = 30 * 1000;
const LAST_FETCHED_KEY = "home_settings_last_fetched";

export const useHomeSettingService = () => {
    const dispatch = useDispatch();
    const homeSettings = useSelector((state) => state.homeSetting.homeSettings);

    const getLastFetched = () => {
        const value = localStorage.getItem(LAST_FETCHED_KEY);
        return value ? parseInt(value, 10) : null;
    };

    const setLastFetched = (timestamp) => {
        localStorage.setItem(LAST_FETCHED_KEY, timestamp.toString());
    };

    const {
        getAllDocs,
        getDocById,
        addDocData,
        updateDocData,
        deleteDocData,
        getDocsByPage,
    } = useFirestore(db, collectionName);

    const getAllHomeSettings = async () => {
        return await getAllDocs();
    };

    const getHomeSettingById = async (id) => {
        return await getDocById(id);
    };

    const addHomeSetting = async (data) => {
        return await addDocData(data);
    };

    const updateHomeSetting = async (id, data) => {
        await updateDocData(id, data);
    };

    const deleteHomeSetting = async (id) => {
        await deleteDocData(id);
    };

    const getHomeSettingsByPage = async ({ pageSize = PAGE_SIZE, lastDoc = null, orderField = ORDER_FIELD }) => {
        return await getDocsByPage({ pageSize, lastDoc, orderField });
    };

    const getHomeSettingsWithStore = async () => {
        const now = Date.now();
        const lastFetched = getLastFetched();
        if (
            homeSettings.length > 0 &&
            lastFetched &&
            now - lastFetched < TIME_EXPIRATION
        ) {
            return homeSettings;
        }
        const allSettings = await getAllHomeSettings();
        dispatch(setHomeSettings(allSettings));
        setLastFetched(now);
        return allSettings;
    };

    return {
        getAllHomeSettings,
        getHomeSettingById,
        addHomeSetting,
        updateHomeSetting,
        deleteHomeSetting,
        getHomeSettingsByPage,
        getHomeSettingsWithStore
    };
}