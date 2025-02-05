import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { saveAs } from "file-saver";

interface SParameters {
    location: {
        state: string;
        city: string;
    };
    populationSize: number;
    seed: string;
    clinicianSeed: string;
    gender: string;
}

export default function MainForm() {
    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<SParameters>({
        defaultValues: {
            location: {
                state: "Alaska",
                city: "",
            },
            populationSize: 1,
            seed: String(Math.floor(Math.random() * 1e6)),
            clinicianSeed: String(Math.floor(Math.random() * 1e6)),
            gender: "Male",
        },
    });

    const fetchOutput: SubmitHandler<SParameters> = async (params) => {
        const URL = `http://localhost:${
            import.meta.env.VITE_SERVER_PORT
        }/generate`;

        try {
            const res = await axios.post(URL, params, {
                responseType: "arraybuffer",
            });
            const blob = new Blob([res.data], { type: "application/zip" });
            saveAs(
                blob,
                res.headers["content-disposition"].split("filename=")[1]
            );
        } catch (err) {
            console.error("Failed to download", err);
            alert("Failed to download generated output from the server");
        }
    };

    return (
        <div className="flex flex-col justify-evenly items-center h-screen bg-green-700">
            <div className="flex flex-col items-center antialiased font-bold text-4xl text-gray-400 font-mono ">
                <p>Synthea UI</p>
                <p className="italic text-black text-sm text-black font-semibold">
                    (version 0.1.0)
                </p>
            </div>
            <form
                className="bg-zinc-300 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
                onSubmit={handleSubmit(fetchOutput)}
            >
                <div className="mb-4">
                    <label
                        className="block text-gray-700 font-bold mb-2"
                        htmlFor="state"
                    >
                        State
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-purple-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="state"
                        type="text"
                        {...register("location.state")}
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 font-bold mb-2"
                        htmlFor="city"
                    >
                        City
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-purple-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="city"
                        type="text"
                        {...register("location.city")}
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 font-bold mb-2"
                        htmlFor="population"
                    >
                        Population
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-purple-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="population"
                        type="text"
                        {...register("populationSize")}
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 font-bold mb-2"
                        htmlFor="seed"
                    >
                        Generator Seed
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-purple-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="seed"
                        type="text"
                        {...register("seed")}
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 font-bold mb-2"
                        htmlFor="cseed"
                    >
                        Clinician Seed
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-purple-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="cseed"
                        type="text"
                        {...register("clinicianSeed")}
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 font-bold mb-2"
                        htmlFor="gender"
                    >
                        Gender of Generated Patients
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-purple-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="gender"
                        type="text"
                        {...register("gender")}
                    />
                </div>
                <div className="flex justify-center">
                    <button
                        className={
                            "bg-purple-900 text-white font-bold py-2 px-4 rounded" +
                            (isSubmitting ? " hidden" : "")
                        }
                        type="submit"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
