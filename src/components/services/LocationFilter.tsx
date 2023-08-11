//TODO: Need to add a Country filter for future phases
import { Component, createEffect, createSignal, For } from 'solid-js';

import { supabase } from '../../lib/supabaseClient'
// import { productCategoryData } from '../../data'
import { ui } from '../../i18n/ui'
import type { uiObject } from '../../i18n/uiType';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const lang = getLangFromUrl(new URL(window.location.href));
const values = ui[lang] as uiObject

let major_municipalities: Array<{ major_municipality: string, id: number }> = [];
let minor_municipalities: Array<{ minor_municipality: string, id: number, major_municipality: number }> = [];
let governing_districts: Array<{ governing_district: string, id: number, minor_municipality: number }> = [];

const { data: major_municipality, error: major_municipality_error } = await supabase.from('major_municipality').select('major_municipality, id');

if (major_municipality_error) {
    console.log("supabase error: " + major_municipality_error.message)
} else {
    major_municipality.forEach(location => {
        major_municipalities.push({ major_municipality: location.major_municipality, id: location.id })
    })
    major_municipalities.sort((a, b) => a.major_municipality > b.major_municipality ? 0 : -1)
}

const { data: minor_municipality, error: minor_municipality_error } = await supabase.from('minor_municipality').select('minor_municipality, id, major_municipality');

if (minor_municipality_error) {
    console.log("supabase error: " + minor_municipality_error.message)
} else {
    minor_municipality.forEach(location => {
        minor_municipalities.push({ minor_municipality: location.minor_municipality, id: location.id, major_municipality: location.major_municipality })
    })
    minor_municipalities.sort((a, b) => a.minor_municipality > b.minor_municipality ? 0 : -1)
}

const { data: governing_district, error: governingDistrictError } = await supabase.from('governing_district').select('governing_district, id, minor_municipality');

if (governingDistrictError) {
    console.log("supabase error: " + governingDistrictError.message)
} else {
    governing_district.forEach(location => {
        governing_districts.push({ governing_district: location.governing_district, id: location.id, minor_municipality: location.minor_municipality })
    })
    governing_districts.sort((a, b) => a.governing_district > b.governing_district ? 0 : -1)
}

interface Props {
    // Define the type for the filterPosts prop
    filterPostsByMajorMunicipality: (location: string) => void;
    filterPostsByMinorMunicipality: (location: string) => void;
    filterPostsByGoverningDistrict: (location: string) => void;
}

export const LocationFilter: Component<Props> = (props) => {
    const [majorMunicipalities, setMajorMunicipalities] = createSignal<Array<{ major_municipality: string, id: number }>>(major_municipalities)
    const [minorMunicipalities, setMinorMunicipalities] = createSignal<Array<{ minor_municipality: string, id: number, major_municipality: number }>>(minor_municipalities)
    const [governingDistricts, setGoverningDistricts] = createSignal<Array<{ governing_district: string, id: number, minor_municipality: number }>>(governing_districts)
    const [locationFilters, setLocationFilters] = createSignal<Array<{ major_municipality: string, id: number }>>([])
    const [minorLocationFilters, setMinorLocationFilters] = createSignal<Array<{ minor_municipality: string, id: number, major_municipality: number }>>([])
    const [governingLocationFilters, setGoverningLocationFilters] = createSignal<Array<{ governing_district: string, id: number, minor_municipality: number }>>([])

    let filteredMinorMunis: Array<{ minor_municipality: string, id: number, major_municipality: number }> = [];
    let filteredGoverningDistricts: Array<{ governing_district: string, id: number, minor_municipality: number }> = [];

    const testFunction = (item: { major_municipality: string, id: number }) => {
        if (locationFilters().includes(item)) {
            let currentLocationFilters = locationFilters().filter((el) => el !== item)
            setLocationFilters(currentLocationFilters)
        } else {
            setLocationFilters([...locationFilters(), item])
        }
        props.filterPostsByGoverningDistrict(item.major_municipality)
    }

    createEffect(() => {
        filteredMinorMunis = [];

        locationFilters().forEach((item) => {
            let currentMinorMunis = minor_municipalities.filter((el) => el.major_municipality === item.id)
            filteredMinorMunis = [...filteredMinorMunis, ...currentMinorMunis]
        })

        if (locationFilters().length === 0) {
            filteredMinorMunis = minor_municipalities
        }
        setMinorMunicipalities(filteredMinorMunis)
    })

    const test2Function = (item: { minor_municipality: string, id: number, major_municipality: number }) => {
        if (minorLocationFilters().includes(item)) {
            let currentMinorLocationFilters = minorLocationFilters().filter((el) => el !== item)
            setMinorLocationFilters(currentMinorLocationFilters)
        } else {
            setMinorLocationFilters([...minorLocationFilters(), item])
        }
        props.filterPostsByMinorMunicipality(item.minor_municipality)
    }

    createEffect(() => {
        filteredGoverningDistricts = [];

        minorLocationFilters().forEach((item) => {
            let currentGoverningDistricts = governing_districts.filter((el) => el.minor_municipality === item.id)
            filteredGoverningDistricts = [...filteredGoverningDistricts, ...currentGoverningDistricts]
        })

        if (minorLocationFilters().length === 0) {
            filteredGoverningDistricts = governing_districts
        }
        setGoverningDistricts(filteredGoverningDistricts)
    })

    const test3Function = (item: { governing_district: string, id: number, minor_municipality: number }) => {
        if (governingLocationFilters().includes(item)) {
            let currentGoverningLocationFilters = governingLocationFilters().filter((el) => el !== item)
            setGoverningLocationFilters(currentGoverningLocationFilters)
        } else {
            setGoverningLocationFilters([...governingLocationFilters(), item])
        }
        props.filterPostsByMinorMunicipality(item.governing_district)
    }

    return (
        <div class="bg-background1 dark:bg-black w-full md:rounded-lg md:border">
            <div class="md:h-56 md:flex-column md:text-left border border-red-500">
                <div class="mt-2 ml-8">Major Municipality</div> {/*TODO:Internationalize */}
                <ul class="md:grid md:text-left md:mr-4 md:ml-8 md:mt-2 md:h-fit md:overflow-auto">
                    <For each={majorMunicipalities()}>{(item) =>
                        <li>
                            <input type="checkbox"
                                class="leading-tight mr-4"
                                onClick={() => {
                                    testFunction(item)
                                }}
                            />
                            <span class="text-text1 dark:text-text1-DM">{item.major_municipality}</span>

                        </li>
                    }</For>
                </ul>
            </div>
            <div class="md:h-56 md:flex-column md:text-left border border-purple-500">
                <div class="mt-2 ml-8">Minor Municipality</div> {/*TODO:Internationalize */}
                <ul class="md:grid md:text-left md:mr-4 md:ml-8 md:mt-2 md:h-full md:overflow-auto"> {/*Combination of h-full and overflow auto causing weird behavior */}
                    <For each={minorMunicipalities()}>{(item) =>
                        <div>
                            <input type="checkbox"
                                class="leading-tight mr-4"
                                onClick={() => {
                                    test2Function(item)
                                }}
                            />
                            <span class="text-text1 dark:text-text1-DM">{item.minor_municipality}</span>

                        </div>
                    }</For>
                </ul>
            </div>
            <div class="md:h-56 md:overflow-auto md:flex md:content-center border border-yellow-500">
                <ul class="md:grid md:text-left md:mr-4 md:ml-8 md:mt-2 md:h-full md:overflow-auto">
                    <p class="mb-2">Governing District</p> {/*TODO:Internationalize */}
                    <For each={governingDistricts()}>{(item) =>
                        <div>
                            <input type="checkbox"
                                class="leading-tight mr-4"
                                onClick={() => {
                                    test3Function(item)
                                }}
                            />
                            <span class="text-text1 dark:text-text1-DM">{item.governing_district}</span>

                        </div>
                    }</For>
                </ul>
            </div>
        </div>

    )
}
