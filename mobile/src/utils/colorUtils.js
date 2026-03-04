
export const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

export const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

export const rgbToCmyk = (r, g, b) => {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, Math.min(m, y));

    c = (c - k) / (1 - k);
    m = (m - k) / (1 - k);
    y = (y - k) / (1 - k);

    return {
        c: Math.round(c * 100) || 0,
        m: Math.round(m * 100) || 0,
        y: Math.round(y * 100) || 0,
        k: Math.round(k * 100) || 0
    };
};

export const rgbToLab = (r, g, b) => {
    let rLinear = r / 255;
    let gLinear = g / 255;
    let bLinear = b / 255;

    rLinear = (rLinear > 0.04045) ? Math.pow((rLinear + 0.055) / 1.055, 2.4) : rLinear / 12.92;
    gLinear = (gLinear > 0.04045) ? Math.pow((gLinear + 0.055) / 1.055, 2.4) : gLinear / 12.92;
    bLinear = (bLinear > 0.04045) ? Math.pow((bLinear + 0.055) / 1.055, 2.4) : bLinear / 12.92;

    let x = (rLinear * 0.4124 + gLinear * 0.3576 + bLinear * 0.1805) * 100;
    let y = (rLinear * 0.2126 + gLinear * 0.7152 + bLinear * 0.0722) * 100;
    let z = (rLinear * 0.0193 + gLinear * 0.1192 + bLinear * 0.9505) * 100;

    let xRef = 95.047;
    let yRef = 100.000;
    let zRef = 108.883;

    let xNorm = x / xRef;
    let yNorm = y / yRef;
    let zNorm = z / zRef;

    xNorm = (xNorm > 0.008856) ? Math.cbrt(xNorm) : (7.787 * xNorm) + (16 / 116);
    yNorm = (yNorm > 0.008856) ? Math.cbrt(yNorm) : (7.787 * yNorm) + (16 / 116);
    zNorm = (zNorm > 0.008856) ? Math.cbrt(zNorm) : (7.787 * zNorm) + (16 / 116);

    const l = (116 * yNorm) - 16;
    const a = 500 * (xNorm - yNorm);
    const bVal = 200 * (yNorm - zNorm);

    return {
        l: Math.round(l * 100) / 100,
        a: Math.round(a * 100) / 100,
        b: Math.round(bVal * 100) / 100
    };
};

export const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

export const hslToRgb = (h, s, l) => {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
};

/**
 * Extensive list of named colors ~1500 items
 */
const colorList = [
    { hex: "#000000", name: "Black / Negro" }, { hex: "#000080", name: "Navy Blue / Azul Marino" }, { hex: "#0000C8", name: "Dark Blue / Azul Oscuro" },
    { hex: "#0000FF", name: "Blue / Azul" }, { hex: "#000741", name: "Stratos / Estratos" }, { hex: "#001B1C", name: "Swamp / Pantano" },
    { hex: "#002387", name: "Resolution Blue / Azul Resolución" }, { hex: "#002900", name: "Deep Fir / Abeto Profundo" }, { hex: "#002E20", name: "Burnham / Burnham" },
    { hex: "#002FA7", name: "International Klein Blue / Azul Klein" }, { hex: "#003153", name: "Prussian Blue / Azul Prusia" }, { hex: "#003366", name: "Midnight Blue / Azul Medianoche" },
    { hex: "#003399", name: "Smalt / Esmalte" }, { hex: "#003532", name: "Deep Teal / Verde Azulado Profundo" }, { hex: "#003E40", name: "Cyprus / Chipre" },
    { hex: "#004620", name: "Kaitoke Green / Verde Kaitoke" }, { hex: "#0047AB", name: "Cobalt / Cobalto" }, { hex: "#004816", name: "Crusoe / Crusoe" },
    { hex: "#004950", name: "Sherpa Blue / Azul Sherpa" }, { hex: "#0056A7", name: "Endeavour / Endeavour" }, { hex: "#00581A", name: "Camarone / Camarón" },
    { hex: "#0066CC", name: "Science Blue / Azul Ciencia" }, { hex: "#0066FF", name: "Blue Ribbon / Cinta Azul" }, { hex: "#00755E", name: "Tropical Rain Forest / Selva Tropical" },
    { hex: "#0076A3", name: "Allports / Allports" }, { hex: "#007BA7", name: "Deep Cerulean / Cerúleo Profundo" }, { hex: "#007EC7", name: "Lochmara / Lochmara" },
    { hex: "#007FFF", name: "Azure Radiance / Resplandor Azur" }, { hex: "#008080", name: "Teal / Cerceta" }, { hex: "#0095B6", name: "Bondi Blue / Azul Bondi" },
    { hex: "#009DC4", name: "Pacific Blue / Azul Pacífico" }, { hex: "#00A693", name: "Persian Green / Verde Persa" }, { hex: "#00A86B", name: "Jade / Jade" },
    { hex: "#00CC99", name: "Caribbean Green / Verde Caribe" }, { hex: "#00CCCC", name: "Robin's Egg Blue / Azul Huevo de Petirrojo" }, { hex: "#00FF00", name: "Green / Verde" },
    { hex: "#00FF7F", name: "Spring Green / Verde Primavera" }, { hex: "#00FFFF", name: "Cyan / Cian" }, { hex: "#010D1A", name: "Blue Charcoal / Carbón Azul" },
    { hex: "#011635", name: "Midnight / Medianoche" }, { hex: "#011D13", name: "Holly / Acebo" }, { hex: "#012731", name: "Daintree / Daintree" },
    { hex: "#01361C", name: "Cardin Green / Verde Cardin" }, { hex: "#01371A", name: "County Green / Verde Condado" }, { hex: "#013E62", name: "Astronaut Blue / Azul Astronauta" },
    { hex: "#013F6A", name: "Regal Blue / Azul Real" }, { hex: "#014B43", name: "Aqua Deep / Aqua Profundo" }, { hex: "#015E85", name: "Orient / Oriente" },
    { hex: "#016162", name: "Blue Stone / Piedra Azul" }, { hex: "#016D39", name: "Fun Green / Verde Divertido" }, { hex: "#01796F", name: "Pine Green / Verde Pino" },
    { hex: "#017987", name: "Blue Lagoon / Laguna Azul" }, { hex: "#01826B", name: "Deep Sea / Mar Profundo" }, { hex: "#01A368", name: "Green Haze / Neblina Verde" },
    { hex: "#022D15", name: "English Holly / Acebo Inglés" }, { hex: "#02402C", name: "Sherwood Green / Verde Sherwood" }, { hex: "#02478E", name: "Congress Blue / Azul Congreso" },
    { hex: "#024E46", name: "Evening Sea / Mar al Atardecer" }, { hex: "#026395", name: "Bahama Blue / Azul Bahama" }, { hex: "#02866F", name: "Observatory / Observatorio" },
    { hex: "#02A4D3", name: "Cerulean / Cerúleo" }, { hex: "#03163C", name: "Tangaroa / Tangaroa" }, { hex: "#032B52", name: "Green Vogue / Verde Moda" },
    { hex: "#036A6E", name: "Mosque / Mezquita" }, { hex: "#041004", name: "Midnight Moss / Musgo de Medianoche" }, { hex: "#041322", name: "Black Pearl / Perla Negra" },
    { hex: "#042E4C", name: "Blue Whale / Ballena Azul" }, { hex: "#044022", name: "Zuccini / Calabacín" }, { hex: "#044259", name: "Teal Blue / Azul Cerceta" },
    { hex: "#051040", name: "Deep Cove / Cala Profunda" }, { hex: "#051657", name: "Gulf Blue / Azul Golfo" }, { hex: "#055989", name: "Venice Blue / Azul Venecia" },
    { hex: "#056F57", name: "Watercourse / Curso de Agua" }, { hex: "#062A78", name: "Catalina Blue / Azul Catalina" }, { hex: "#063537", name: "Tiber / Tíber" },
    { hex: "#069B81", name: "Gossamer / Gasa" }, { hex: "#06A189", name: "Niagara / Niágara" }, { hex: "#073A50", name: "Tarawera / Tarawera" },
    { hex: "#080110", name: "Jaguar / Jaguar" }, { hex: "#081910", name: "Black Bean / Frijol Negro" }, { hex: "#082567", name: "Deep Sapphire / Zafiro Profundo" },
    { hex: "#088370", name: "Elf Green / Verde Elfo" }, { hex: "#08E8DE", name: "Bright Turquoise / Turquesa Brillante" }, { hex: "#092256", name: "Downriver / Río Abajo" },
    { hex: "#09230F", name: "Palm Green / Verde Palma" }, { hex: "#09255D", name: "Madison / Madison" }, { hex: "#093624", name: "Bottle Green / Verde Botella" },
    { hex: "#095859", name: "Deep Sea Green / Verde Mar Profundo" }, { hex: "#097F4B", name: "Salem / Salem" }, { hex: "#0A001C", name: "Black Russian / Ruso Negro" },
    { hex: "#0A480D", name: "Dark Fern / Helecho Oscuro" }, { hex: "#0A6906", name: "Japanese Laurel / Laurel Japonés" }, { hex: "#0A6F75", name: "Atoll / Atolón" },
    { hex: "#0B0B0B", name: "Cod Gray / Gris Bacalao" }, { hex: "#0B0F08", name: "Marshland / Pantano" }, { hex: "#0B1107", name: "Gordons Green / Verde Gordon" },
    { hex: "#0B1304", name: "Black Forest / Selva Negra" }, { hex: "#0B6207", name: "San Felix / San Félix" }, { hex: "#0BDA51", name: "Malachite / Malaquita" },
    { hex: "#0C0B1E", name: "Ebony / Ébano" }, { hex: "#0C0D0F", name: "Woodsmoke / Humo de Leña" }, { hex: "#0C1911", name: "Racing Green / Verde de Carreras" },
    { hex: "#0C7A79", name: "Surfie Green / Verde Surfie" }, { hex: "#0C8990", name: "Blue Chill / Escalofrío Azul" }, { hex: "#0D0332", name: "Black Rock / Roca Negra" },
    { hex: "#0D1117", name: "Bunker / Búnker" }, { hex: "#0D1C19", name: "Aztec / Azteca" }, { hex: "#0D2E1C", name: "Bush / Arbusto" },
    { hex: "#0E0E18", name: "Cinder / Ceniza" }, { hex: "#0E2A30", name: "Firefly / Luciérnaga" }, { hex: "#0F2D9E", name: "Torea Bay / Bahía Torea" },
    { hex: "#10121D", name: "Vulcan / Vulcano" }, { hex: "#101405", name: "Green Waterloo / Verde Waterloo" }, { hex: "#105852", name: "Eden / Edén" },
    { hex: "#110C6C", name: "Arapawa / Arapawa" }, { hex: "#120A8F", name: "Ultramarine / Ultramar" }, { hex: "#123447", name: "Elephant / Elefante" },
    { hex: "#126B40", name: "Jewel / Joya" }, { hex: "#130000", name: "Diesel / Diésel" }, { hex: "#130A06", name: "Asphalt / Asfalto" },
    { hex: "#13264D", name: "Blue Zodiac / Zodiaco Azul" }, { hex: "#134F19", name: "Parsley / Perejil" }, { hex: "#140600", name: "Nero / Nerón" },
    { hex: "#1450AA", name: "Tory Blue / Azul Tory" }, { hex: "#151F4C", name: "Bunting / Escribano" }, { hex: "#1560BD", name: "Denim / Mezclilla" },
    { hex: "#15736B", name: "Genoa / Génova" }, { hex: "#161928", name: "Mirage / Espejismo" }, { hex: "#161D10", name: "Hunter Green / Verde Cazador" },
    { hex: "#162A40", name: "Big Stone / Piedra Grande" }, { hex: "#163222", name: "Celtic / Celta" }, { hex: "#16322C", name: "Timber Green / Verde Madera" },
    { hex: "#163531", name: "Gable Green / Verde Gable" }, { hex: "#171F04", name: "Pine Tree / Pino" }, { hex: "#175579", name: "Chathams Blue / Azul Chathams" },
    { hex: "#182D09", name: "Deep Forest Green / Verde Bosque Profundo" }, { hex: "#18587A", name: "Blumine / Blumine" }, { hex: "#19330E", name: "Palm Leaf / Hoja de Palma" },
    { hex: "#193751", name: "Nile Blue / Azul Nilo" }, { hex: "#1959A8", name: "Fun Blue / Azul Divertido" }, { hex: "#1A1A68", name: "Lucky Point / Punto de Suerte" },
    { hex: "#1AB385", name: "Mountain Meadow / Prado de Montaña" }, { hex: "#1B0245", name: "Tolopea / Tolopea" }, { hex: "#1B1035", name: "Haiti / Haití" },
    { hex: "#1B127B", name: "Deep Koamaru / Koamaru Profundo" }, { hex: "#1B1404", name: "Acadia / Acadia" }, { hex: "#1B2F11", name: "Seaweed / Alga Marina" },
    { hex: "#1B3162", name: "Biscay / Vizcaya" }, { hex: "#1B659D", name: "Matisse / Matisse" }, { hex: "#1C1208", name: "Crowshead / Cabeza de Cuervo" },
    { hex: "#1C1E13", name: "Rangoon Green / Verde Rangún" }, { hex: "#1C39BB", name: "Persian Blue / Azul Persa" }, { hex: "#1C402E", name: "Everglade / Pantanal" },
    { hex: "#1C7C7D", name: "Elm / Olmo" }, { hex: "#1D6142", name: "Green Pea / Guisante Verde" }, { hex: "#1E0F04", name: "Creole / Criollo" },
    { hex: "#1E1609", name: "Karaka / Karaka" }, { hex: "#1E1708", name: "El Paso / El Paso" }, { hex: "#1E385B", name: "Cello / Violonchelo" },
    { hex: "#1E433C", name: "Te Papa Green / Verde Te Papa" }, { hex: "#1E90FF", name: "Dodger Blue / Azul Dodger" }, { hex: "#1E9AB0", name: "Eastern Blue / Azul Oriental" },
    { hex: "#1F120F", name: "Night Rider / Jinete Nocturno" }, { hex: "#1FC2C2", name: "Java / Java" }, { hex: "#20208D", name: "Jacksons Purple / Púrpura Jackson" },
    { hex: "#202E54", name: "Cloud Burst / Estallido de Nubes" }, { hex: "#204852", name: "Blue Dianne / Azul Dianne" }, { hex: "#211A0E", name: "Eternity / Eternidad" },
    { hex: "#220878", name: "Deep Blue / Azul Profundo" }, { hex: "#228B22", name: "Forest Green / Verde Bosque" }, { hex: "#233418", name: "Mallard / Pato Real" },
    { hex: "#240A40", name: "Violet / Violeta" }, { hex: "#240C02", name: "Kilamanjaro / Kilamanjaro" }, { hex: "#242A1D", name: "Log Cabin / Cabaña de Troncos" },
    { hex: "#242E16", name: "Black Olive / Oliva Negra" }, { hex: "#24500F", name: "Green House / Invernadero" }, { hex: "#251607", name: "Graphite / Grafito" },
    { hex: "#251706", name: "Cannon Black / Negro Cañón" }, { hex: "#251F4F", name: "Port Gore / Port Gore" }, { hex: "#25272C", name: "Shark / Tiburón" },
    { hex: "#25311C", name: "Green Kelp / Alga Verde" }, { hex: "#2596D1", name: "Curious Blue / Azul Curioso" }, { hex: "#260368", name: "Paua / Paua" },
    { hex: "#26056A", name: "Paris M / Paris M" }, { hex: "#261105", name: "Wood Bark / Corteza de Madera" }, { hex: "#261414", name: "Gondola / Góndola" },
    { hex: "#262335", name: "Steel Gray / Gris Acero" }, { hex: "#26283B", name: "Ebony Clay / Arcilla de Ébano" }, { hex: "#273A81", name: "Bay of Many / Bahía de Muchos" },
    { hex: "#27504B", name: "Plantation / Plantación" }, { hex: "#278A5B", name: "Eucalyptus / Eucalipto" }, { hex: "#281E15", name: "Oil / Aceite" },
    { hex: "#283A77", name: "Astronaut / Astronauta" }, { hex: "#286ACD", name: "Mariner / Marinero" }, { hex: "#290C02", name: "Violent Violet / Violeta Violento" },
    { hex: "#29221F", name: "Bastille / Bastilla" }, { hex: "#292937", name: "Zeus / Zeus" }, { hex: "#297B9A", name: "Jelly Bean / Frijol de Jalea" },
    { hex: "#29AB87", name: "Jungle Green / Verde Selva" }, { hex: "#2A0359", name: "Cherry Pie / Pastel de Cereza" }, { hex: "#2A140E", name: "Coffee Bean / Grano de Café" },
    { hex: "#2A2630", name: "Baltic Sea / Mar Báltico" }, { hex: "#2A380B", name: "Turtle Green / Verde Tortuga" }, { hex: "#2A52BE", name: "Cerulean Blue / Azul Cerúleo" },
    { hex: "#2B0202", name: "Sepia Black / Negro Sepia" }, { hex: "#2B194F", name: "Valhalla / Valhalla" }, { hex: "#2B3228", name: "Heavy Metal / Metal Pesado" },
    { hex: "#2C0E8C", name: "Blue Gem / Gema Azul" }, { hex: "#2C1632", name: "Revolver / Revólver" }, { hex: "#2C2133", name: "Bleached Cedar / Cedro Blanqueado" },
    { hex: "#2C8C84", name: "Lochinvar / Lochinvar" }, { hex: "#2D2510", name: "Mikado / Mikado" }, { hex: "#2D383A", name: "Outer Space / Espacio Exterior" },
    { hex: "#2D569B", name: "St Tropaz / San Tropez" }, { hex: "#2E0329", name: "Jacaranda / Jacaranda" }, { hex: "#2E1905", name: "Jacko Bean / Frijol Jacko" },
    { hex: "#2E3222", name: "Rangitoto / Rangitoto" }, { hex: "#2E3F62", name: "Rhino / Rinoceronte" }, { hex: "#2E8B57", name: "Sea Green / Verde Mar" },
    { hex: "#2EBFD4", name: "Scooter / Scooter" }, { hex: "#2F270E", name: "Onion / Cebolla" }, { hex: "#2F3CB3", name: "Governor Bay / Bahía del Gobernador" },
    { hex: "#2F519E", name: "Sapphire / Zafiro" }, { hex: "#2F5A57", name: "Spectra / Espectros" }, { hex: "#2F6168", name: "Casal / Casal" },
    { hex: "#300529", name: "Melanzane / Berenjena" }, { hex: "#301F1E", name: "Cocoa Brown / Marrón Cacao" }, { hex: "#302A0F", name: "Woodrush / Junco de Madera" },
    { hex: "#304B6A", name: "San Marino / San Marino" }, { hex: "#30D5C8", name: "Turquoise / Turquesa" }, { hex: "#311C17", name: "Eclipse / Eclipse" },
    { hex: "#314459", name: "Pickled Bluewood / Madera Azul Encurtida" }, { hex: "#315BA1", name: "Azure / Azur" }, { hex: "#31728D", name: "Calypso / Calipso" },
    { hex: "#317D82", name: "Paradiso / Paradiso" }, { hex: "#32127A", name: "Persian Indigo / Índigo Persa" }, { hex: "#32293A", name: "Blackcurrant / Grosella Negra" },
    { hex: "#323232", name: "Mine Shaft / Pozo de Mina" }, { hex: "#325D52", name: "Stromboli / Stromboli" }, { hex: "#327C14", name: "Bilbao / Bilbao" },
    { hex: "#327DA0", name: "Astral / Astral" }, { hex: "#33036B", name: "Christalle / Cristalle" }, { hex: "#33292F", name: "Thunder / Trueno" },
    { hex: "#33CC99", name: "Shamrock / Trébol" }, { hex: "#341515", name: "Tamarind / Tamarindo" }, { hex: "#350036", name: "Mardi Gras / Mardi Gras" },
    { hex: "#350E42", name: "Valentino / Valentino" }, { hex: "#350E57", name: "Jagger / Jagger" }, { hex: "#353542", name: "Tuna / Atún" },
    { hex: "#354E8C", name: "Chambray / Chambray" }, { hex: "#363050", name: "Martinique / Martinica" }, { hex: "#363534", name: "Tuatara / Tuatara" },
    { hex: "#363C0D", name: "Waiouru / Waiouru" }, { hex: "#36747D", name: "Ming / Ming" }, { hex: "#36872D", name: "La Palma / La Palma" },
    { hex: "#370202", name: "Chocolate / Chocolate" }, { hex: "#371D09", name: "Clinker / Clinker" }, { hex: "#37290E", name: "Brown Tumbleweed / Cardo Ruso Marrón" },
    { hex: "#373021", name: "Birch / Abedul" }, { hex: "#377475", name: "Oracle / Oráculo" }, { hex: "#380474", name: "Blue Diamond / Diamante Azul" },
    { hex: "#381A51", name: "Grape / Uva" }, { hex: "#383533", name: "Dune / Duna" }, { hex: "#384555", name: "Oxford Blue / Azul Oxford" },
    { hex: "#384910", name: "Clover / Trébol" }, { hex: "#394851", name: "Limed Spruce / Abeto Calizo" }, { hex: "#396413", name: "Dell / Valle" },
    { hex: "#39A78E", name: "Toledo / Toledo" }, { hex: "#3A0020", name: "Toledo / Toledo" }, { hex: "#3A2010", name: "Meteor / Meteoro" },
    { hex: "#3A2A6A", name: "Dark Hblue / Azul H Oscuro" }, { hex: "#3A686C", name: "William / William" }, { hex: "#3A6A47", name: "Tibetan Green / Verde Tibetano" },
    { hex: "#3AB09E", name: "Keppel / Keppel" }, { hex: "#3B000B", name: "Melrose / Melrose" }, { hex: "#3B0910", name: "Rosewood / Palo de Rosa" },
    { hex: "#3B1F1F", name: "Saddle / Silla de Montar" }, { hex: "#3B2820", name: "Cocoa / Cacao" }, { hex: "#3B7A57", name: "Amazon / Amazonas" },
    { hex: "#3B91B4", name: "Boston Blue / Azul Boston" }, { hex: "#3C0878", name: "Windsor / Windsor" }, { hex: "#3C1206", name: "Rebel / Rebelde" },
    { hex: "#3C1F76", name: "Meteorite / Meteorito" }, { hex: "#3C2005", name: "Dark Ebony / Ébano Oscuro" }, { hex: "#3C3910", name: "Camouflage / Camuflaje" },
    { hex: "#3C4151", name: "Bright Gray / Gris Brillante" }, { hex: "#3C4443", name: "Cape Cod / Cabo Cod" }, { hex: "#3C493A", name: "Lunar Green / Verde Lunar" },
    { hex: "#3D0C02", name: "Bean / Frijol" }, { hex: "#3D2B1F", name: "Bistre / Bistre" }, { hex: "#3D7D52", name: "Goblin / Duende" },
    { hex: "#3E0480", name: "Kingfisher Daisy / Margarita Martín Pescador" }, { hex: "#3E1C14", name: "Cedar / Cedro" }, { hex: "#3E2B23", name: "English Walnut / Nuez Inglesa" },
    { hex: "#3E2C1C", name: "Black Marlin / Marlín Negro" }, { hex: "#3E3A44", name: "Ship Gray / Gris Barco" }, { hex: "#3EABBF", name: "Pelorous / Pelorous" },
    { hex: "#3F2109", name: "Bronze / Bronce" }, { hex: "#3F2500", name: "Cola / Cola" }, { hex: "#3F3002", name: "Madras / Madras" },
    { hex: "#3F307F", name: "Minsk / Minsk" }, { hex: "#3F4C2A", name: "Cabbage Pont / Repollo Pont" }, { hex: "#3F583B", name: "Tom Thumb / Tom Thumb" },
    { hex: "#3F5D53", name: "Mineral Green / Verde Mineral" }, { hex: "#3FC1AA", name: "Puerto Rico / Puerto Rico" }, { hex: "#3FFF00", name: "Harlequin / Arlequín" },
    { hex: "#401801", name: "Brown Pod / Vaina Marrón" }, { hex: "#40291D", name: "Cork / Corcho" }, { hex: "#403B38", name: "Masala / Masala" },
    { hex: "#403D19", name: "Thatch Green / Verde Paja" }, { hex: "#405169", name: "Fiord / Fiordo" }, { hex: "#40826D", name: "Viridian / Viridiano" },
    { hex: "#40A860", name: "Chateau Green / Verde Castillo" }, { hex: "#410056", name: "Ripe Plum / Ciruela Madura" }, { hex: "#411F10", name: "Paco / Paco" },
    { hex: "#412010", name: "Deep Oak / Roble Profundo" }, { hex: "#413C03", name: "Merlin / Merlín" }, { hex: "#414257", name: "Gun Powder / Pólvora" },
    { hex: "#414C7D", name: "East Bay / Bahía del Este" }, { hex: "#4169E1", name: "Royal Blue / Azul Real" }, { hex: "#41AA78", name: "Ocean Green / Verde Océano" },
    { hex: "#420303", name: "Burnt Maroon / Granate Quemado" }, { hex: "#423921", name: "Lisbon Brown / Marrón Lisboa" }, { hex: "#427977", name: "Faded Jade / Jade Desvanecido" },
    { hex: "#431560", name: "Scarlet Gum / Goma Escarlata" }, { hex: "#433120", name: "Iroko / Iroko" }, { hex: "#433E37", name: "Armadillo / Armadillo" },
    { hex: "#434C59", name: "River Bed / Lecho de Río" }, { hex: "#436A0D", name: "Green Leaf / Hoja Verde" }, { hex: "#44012D", name: "Barossa / Barossa" },
    { hex: "#441D00", name: "Morocco Brown / Marrón Marruecos" }, { hex: "#444954", name: "Mako / Mako" }, { hex: "#454936", name: "Kelp / Quelpo" },
    { hex: "#456CAC", name: "San Marino / San Marino" }, { hex: "#45B1E8", name: "Picton Blue / Azul Picton" }, { hex: "#460B41", name: "Loulou / Loulou" },
    { hex: "#462425", name: "Crater Brown / Marrón Cráter" }, { hex: "#465945", name: "Gray Asparagus / Espárrago Gris" }, { hex: "#4682B4", name: "Steel Blue / Azul Acero" },
    { hex: "#480404", name: "Rustic Red / Rojo Rústico" }, { hex: "#480607", name: "Bulgarian Rose / Rosa Búlgara" }, { hex: "#480656", name: "Clairvoyant / Clarividente" },
    { hex: "#481C1C", name: "Cocoa Bean / Grano de Cacao" }, { hex: "#483131", name: "Woody Brown / Marrón Leñoso" }, { hex: "#483C32", name: "Taupe / Topo" },
    { hex: "#49170C", name: "Van Cleef / Van Cleef" }, { hex: "#492615", name: "Brown Derby / Derby Marrón" }, { hex: "#49371B", name: "Metallic Bronze / Bronce Metálico" },
    { hex: "#495400", name: "Verdun Green / Verde Verdún" }, { hex: "#496679", name: "Blue Magerite / Margarita Azul" }, { hex: "#497183", name: "Mid Gray / Gris Medio" },
    { hex: "#4A2A04", name: "Bracken / Helecho" }, { hex: "#4A3004", name: "Deep Bronze / Bronce Profundo" }, { hex: "#4A3C30", name: "Mondo / Mondo" },
    { hex: "#4A4244", name: "Tundora / Tundora" }, { hex: "#4A444B", name: "Gravel / Grava" }, { hex: "#4A4E5A", name: "Trout / Trucha" },
    { hex: "#4B0082", name: "Pigment Indigo / Índigo Pigmento" }, { hex: "#4B5D52", name: "Nandor / Nandor" }, { hex: "#4B6113", name: "Saddle / Silla" },
    { hex: "#4C3024", name: "Esspresso / Café Expreso" }, { hex: "#4C4F56", name: "Shuttle Gray / Gris Transbordador" }, { hex: "#4D0135", name: "Mulberry / Mora" },
    { hex: "#4D0A18", name: "Patteson / Patteson" }, { hex: "#4D1E01", name: "Haire / Haire" }, { hex: "#4D282D", name: "Gurnard / Rubio" },
    { hex: "#4D282E", name: "Violet Eggplant / Berenjena Violeta" }, { hex: "#4D3833", name: "Matterhorn / Matterhorn" }, { hex: "#4D3D14", name: "Bronze Olive / Oliva Bronce" },
    { hex: "#4D400F", name: "Olive Drab / Verde Oliva Militar" }, { hex: "#4D5328", name: "Woodland / Bosque" }, { hex: "#4E0606", name: "Mahogany / Caoba" },
    { hex: "#4E2A5A", name: "Bossanova / Bossa Nova" }, { hex: "#4E3B41", name: "Matterhorn / Matterhorn" }, { hex: "#4E420C", name: "Bronze Olive / Oliva Bronce" },
    { hex: "#4E4562", name: "Mulled Wine / Vino Caliente" }, { hex: "#4E6649", name: "Axolotl / Ajolote" }, { hex: "#4E7F9E", name: "Wedgewood / Wedgewood" },
    { hex: "#4EABD1", name: "Shakespeare / Shakespeare" }, { hex: "#4F1C77", name: "Honey Flower / Flor de Miel" }, { hex: "#4F2398", name: "Daisy Bush / Arbusto de Margaritas" },
    { hex: "#4F69C6", name: "Indigo / Índigo" }, { hex: "#4F7942", name: "Fern Green / Verde Helecho" }, { hex: "#4F9D5D", name: "Fruit Salad / Ensalada de Frutas" },
    { hex: "#4FA83D", name: "Apple / Manzana" }, { hex: "#504351", name: "Mortar / Mortero" }, { hex: "#507096", name: "Kashmir Blue / Azul Cachemira" },
    { hex: "#507672", name: "Cutty Sark / Cutty Sark" }, { hex: "#50C878", name: "Emerald / Esmeralda" }, { hex: "#514649", name: "Emperor / Emperador" },
    { hex: "#516E3D", name: "Chalet Green / Verde Chalet" }, { hex: "#517C66", name: "Como / Como" }, { hex: "#51808F", name: "Smalt Blue / Azul Esmalte" },
    { hex: "#52001F", name: "Castro" }, { hex: "#520C17", name: "Maroon Oak / Roble Granate" }, { hex: "#523C94", name: "Gigas / Gigas" },
    { hex: "#533455", name: "Voodoo / Vudú" }, { hex: "#534491", name: "Victoria / Victoria" }, { hex: "#53824B", name: "Hippie Green / Verde Hippie" },
    { hex: "#541012", name: "Heath / Brezo" }, { hex: "#544333", name: "Judge Gray / Gris Juez" }, { hex: "#54534D", name: "Fuscous Gray / Gris Fusco" },
    { hex: "#549019", name: "Vida Loca / Vida Loca" }, { hex: "#55280C", name: "Cioccolato / Cioccolato" }, { hex: "#555B10", name: "Saratoga / Saratoga" },
    { hex: "#556D56", name: "Finlandia / Finlandia" }, { hex: "#5590D9", name: "Havelock Blue / Azul Havelock" }, { hex: "#560319", name: "Scarlett / Escarlata" },
    { hex: "#56B4BE", name: "Fountain Blue / Azul Fuente" }, { hex: "#578363", name: "Spring Leaves / Hojas de Primavera" }, { hex: "#583401", name: "Saddle Brown / Marrón Silla de Montar" },
    { hex: "#585562", name: "Scarpa Flow / Flujo Scarpa" }, { hex: "#587156", name: "Cactus / Cactus" }, { hex: "#589AAF", name: "Hippie Blue / Azul Hippie" },
    { hex: "#591D35", name: "Wine Berry / Baya de Vino" }, { hex: "#592804", name: "Brown Bramble / Zarza Marrón" }, { hex: "#593737", name: "Congo Brown / Marrón Congo" },
    { hex: "#594433", name: "Millbrook / Millbrook" }, { hex: "#5A6E9C", name: "Waikawa Gray / Gris Waikawa" }, { hex: "#5A8700", name: "Wasabi / Wasabi" },
    { hex: "#5B3013", name: "Nutmeg / Nuez Moscada" }, { hex: "#5C0120", name: "Rose Buds / Capullos de Rosa" }, { hex: "#5C0536", name: "Imperial Red / Rojo Imperial" },
    { hex: "#5C2E01", name: "Antique Bronze / Bronce Antiguo" }, { hex: "#5C5D75", name: "Comet / Cometa" }, { hex: "#5D1E0F", name: "Redwood / Secoya" },
    { hex: "#5D4C51", name: "Don Juan / Don Juan" }, { hex: "#5D5C58", name: "Chicago / Chicago" }, { hex: "#5D5E37", name: "Verdigris / Cardenillo" },
    { hex: "#5D7747", name: "Dingley / Dingley" }, { hex: "#5DA19F", name: "Breaker Bay / Bahía Rompeolas" }, { hex: "#5E483E", name: "Kabul / Kabul" },
    { hex: "#5E5D3B", name: "Hemlock / Cicuta" }, { hex: "#5F3D26", name: "Irish Coffee / Café Irlandés" }, { hex: "#5F5F6E", name: "Mid Gray / Gris Medio" },
    { hex: "#5F6672", name: "Shuttle Gray / Gris Transbordador" }, { hex: "#5FA777", name: "Aqua Forest / Bosque Aqua" }, { hex: "#5FB3AC", name: "Tradewind / Viento Alíseo" },
    { hex: "#604913", name: "Horses Neck / Cuello de Caballo" }, { hex: "#605B73", name: "Smoky / Ahumado" }, { hex: "#606E68", name: "Corduroy / Pana" },
    { hex: "#6093D1", name: "Danube / Danubio" }, { hex: "#612718", name: "Espresso / Café Expreso" }, { hex: "#614051", name: "Eggplant / Berenjena" },
    { hex: "#615D30", name: "Costa Del Sol / Costa del Sol" }, { hex: "#61845F", name: "Glade Green / Verde Claro" }, { hex: "#622F30", name: "Buccaneer / Bucanero" },
    { hex: "#623F2D", name: "Quincy / Quincy" }, { hex: "#624E9A", name: "Butterfly Bush / Arbusto de Mariposas" }, { hex: "#625119", name: "West Coast / Costa Oeste" },
    { hex: "#626649", name: "Finch / Pinzón" }, { hex: "#639A8F", name: "Patina / Pátina" }, { hex: "#63B76C", name: "Fern / Helecho" },
    { hex: "#6456B7", name: "Blue Violet / Violeta Azul" }, { hex: "#646077", name: "Dolphin / Delfín" }, { hex: "#646463", name: "Storm Dust / Polvo de Tormenta" },
    { hex: "#646A54", name: "Siam / Siam" }, { hex: "#646E75", name: "Nevada / Nevada" }, { hex: "#6495ED", name: "Cornflower Blue / Azul Aciano" },
    { hex: "#64CCDB", name: "Viking / Vikingo" }, { hex: "#65000B", name: "Rosewood / Palo de Rosa" }, { hex: "#651A14", name: "Cherrywood / Madera de Cerezo" },
    { hex: "#652DC1", name: "Purple Heart / Corazón Púrpura" }, { hex: "#657220", name: "Fern Frond / Fronda de Helecho" }, { hex: "#65745D", name: "Willow Grove / Arboleda de Sauces" },
    { hex: "#65869F", name: "Hoki / Hoki" }, { hex: "#660045", name: "Pompadour / Pompadour" }, { hex: "#660099", name: "Purple / Púrpura" },
    { hex: "#66023C", name: "Tyrian Purple / Púrpura Tirio" }, { hex: "#661010", name: "Dark Tan / Bronceado Oscuro" }, { hex: "#66B58F", name: "Silver Tree / Árbol Plateado" },
    { hex: "#66FF00", name: "Bright Green / Verde Brillante" }, { hex: "#66FF66", name: "Screamin' Green / Verde Chillón" }, { hex: "#67032D", name: "Black Rose / Rosa Negra" },
    { hex: "#675FA6", name: "Scampi / Cigala" }, { hex: "#676662", name: "Ironside Gray / Gris Ironside" }, { hex: "#678975", name: "Viridian Green / Verde Viridiano" },
    { hex: "#67A712", name: "Christi / Christi" }, { hex: "#683600", name: "Nutmeg Wood Finish / Acabado Madera Nuez" }, { hex: "#685558", name: "Zambezi / Zambezi" },
    { hex: "#685E6E", name: "Salt Box / Caja de Sal" }, { hex: "#692545", name: "Tawny Port / Oporto Leonado" }, { hex: "#692D54", name: "Finn / Finn" },
    { hex: "#695F62", name: "Scorpion / Escorpión" }, { hex: "#697E9A", name: "Lynch / Lynch" }, { hex: "#6A442E", name: "Spice / Especia" },
    { hex: "#6A5D1B", name: "Himalaya / Himalaya" }, { hex: "#6A6051", name: "Soya Bean / Soja" }, { hex: "#6B2A14", name: "Hairy Heath / Brezo Peludo" },
    { hex: "#6B3FA0", name: "Royal Purple / Púrpura Real" }, { hex: "#6B4E31", name: "Shingle Fawn / Cervatillo Guijarro" }, { hex: "#6B5755", name: "Dorado / Dorado" },
    { hex: "#6B8BA2", name: "Bermuda Gray / Gris Bermudas" }, { hex: "#6B8E23", name: "Olive Drab / Verde Oliva Militar" }, { hex: "#6C3082", name: "Eminence / Eminencia" },
    { hex: "#6CDAE7", name: "Turquoise Blue / Azul Turquesa" }, { hex: "#6D0101", name: "Lonestar / Estrella Solitaria" }, { hex: "#6D5E54", name: "Pine Cone / Piña" },
    { hex: "#6D6C6C", name: "Dove Gray / Gris Paloma" }, { hex: "#6D9292", name: "Juniper / Enebro" }, { hex: "#6D92A1", name: "Gothic / Gótico" },
    { hex: "#6E0902", name: "Red Oxide / Óxido Rojo" }, { hex: "#6E1D14", name: "Moccaccino / Moca" }, { hex: "#6E4826", name: "Pickled Bean / Frijol Encurtido" },
    { hex: "#6E4B26", name: "Dallas / Dallas" }, { hex: "#6E6D57", name: "Kokoda / Kokoda" }, { hex: "#6E7783", name: "Pale Sky / Cielo Pálido" },
    { hex: "#6F440C", name: "Cafe Royale / Café Real" }, { hex: "#6F6A61", name: "Flint / Pedernal" }, { hex: "#6F8E63", name: "Highland / Tierras Altas" },
    { hex: "#6F9D02", name: "Limeade / Limonada" }, { hex: "#6FD0C5", name: "Downy / Velloso" }, { hex: "#701C1C", name: "Persian Plum / Ciruela Persa" },
    { hex: "#704214", name: "Sepia / Sepia" }, { hex: "#704A07", name: "Antique Bronze / Bronce Antiguo" }, { hex: "#704F50", name: "Ferra / Ferra" },
    { hex: "#706555", name: "Coffee / Café" }, { hex: "#708090", name: "Slate Gray / Gris Pizarra" }, { hex: "#711A00", name: "Cedar Wood Finish / Acabado Madera Cedro" },
    { hex: "#71291D", name: "Metallic Copper / Cobre Metálico" }, { hex: "#714693", name: "Affair / Asunto" }, { hex: "#714AB2", name: "Studio / Estudio" },
    { hex: "#715D47", name: "Tobacco Brown / Marrón Tabaco" }, { hex: "#716338", name: "Yellow Metal / Metal Amarillo" }, { hex: "#716E61", name: "Peat / Turba" },
    { hex: "#717466", name: "Olivetone / Tono Oliva" }, { hex: "#72010F", name: "Bordeaux / Burdeos" }, { hex: "#724A2F", name: "Raw Umber / Sombra Natural" },
    { hex: "#726D4E", name: "Go Ben / Go Ben" }, { hex: "#727B89", name: "Raven / Cuervo" }, { hex: "#731E8F", name: "Seance / Espiritismo" },
    { hex: "#734A12", name: "Raw Umber / Sombra Natural" }, { hex: "#736C9F", name: "Kimberly / Kimberly" }, { hex: "#736D58", name: "Crocodile / Cocodrilo" },
    { hex: "#737C8A", name: "Manatee / Manatí" }, { hex: "#73A9C2", name: "Dixie / Dixie" }, { hex: "#743439", name: "Aubergine / Berenjena" },
    { hex: "#74C365", name: "Mantis / Mantis" }, { hex: "#750404", name: "Russett / Rojizo" }, { hex: "#753944", name: "Puce / Puce" },
    { hex: "#755A57", name: "Russett / Rojizo" }, { hex: "#7563A8", name: "Deluge / Diluvio" }, { hex: "#76395D", name: "Cosmic / Cósmico" },
    { hex: "#7666C6", name: "Blue Marguerite / Margarita Azul" }, { hex: "#76BD17", name: "Lima / Lima" }, { hex: "#76D7EA", name: "Sky Blue / Azul Cielo" },
    { hex: "#770F05", name: "Dark Burgundy / Borgoña Oscuro" }, { hex: "#771F1F", name: "Crown of Thorns / Corona de Espinas" }, { hex: "#773F1A", name: "Walnut / Nogal" },
    { hex: "#776F61", name: "Pablo / Pablo" }, { hex: "#778120", name: "Pacifika / Pacifika" }, { hex: "#779E86", name: "Oxley / Oxley" },
    { hex: "#77DD77", name: "Pastel Green / Verde Pastel" }, { hex: "#780109", name: "Japanese Maple / Arce Japonés" }, { hex: "#782D19", name: "Mocha / Moca" },
    { hex: "#782F16", name: "Peanut / Maní" }, { hex: "#78866B", name: "Camouflage Green / Verde Camuflaje" }, { hex: "#788A25", name: "Wasabi / Wasabi" },
    { hex: "#788BBA", name: "Ship Cove / Cala de Barcos" }, { hex: "#78A39C", name: "Sea Nymph / Ninfa del Mar" }, { hex: "#795D4C", name: "Roman Coffee / Café Romano" },
    { hex: "#796878", name: "Old Lavender / Lavanda Vieja" }, { hex: "#796989", name: "Rum / Ron" }, { hex: "#796A78", name: "Fedora / Fedora" },
    { hex: "#796D29", name: "Sandstone / Arenisca" }, { hex: "#79DEEC", name: "Spray / Rocío" }, { hex: "#7A013A", name: "Siren / Sirena" },
    { hex: "#7A58C1", name: "Fuchsia Blue / Azul Fucsia" }, { hex: "#7A7A7A", name: "Boulder / Roca" }, { hex: "#7A89B8", name: "Wild Blue Yonder / Azul Silvestre Lejano" },
    { hex: "#7AC488", name: "De York / De York" }, { hex: "#7B3801", name: "Red Beech / Haya Roja" }, { hex: "#7B3F00", name: "Cinnamon / Canela" },
    { hex: "#7B6608", name: "Yukon Gold / Oro de Yukón" }, { hex: "#7B7874", name: "Tapa / Tapa" }, { hex: "#7B7C94", name: "Waterloo / Waterloo" },
    { hex: "#7B8265", name: "Flax Smoke / Humo de Lino" }, { hex: "#7B9F80", name: "Amulet / Amuleto" }, { hex: "#7BA05B", name: "Asparagus / Espárrago" },
    { hex: "#7C1C05", name: "Kenyan Copper / Cobre Keniano" }, { hex: "#7C7631", name: "Pesto / Pesto" }, { hex: "#7C778A", name: "Topaz / Topacio" },
    { hex: "#7C7B7A", name: "Concord / Concordia" }, { hex: "#7C7C7C", name: "Jumbo / Jumbo" }, { hex: "#7C881A", name: "Trendy Green / Verde de Moda" },
    { hex: "#7CA1A6", name: "Gumbo / Gumbo" }, { hex: "#7CB0A1", name: "Acapulco / Acapulco" }, { hex: "#7CB7BB", name: "Neptune / Neptuno" },
    { hex: "#7D2C14", name: "Pueblo / Pueblo" }, { hex: "#7DA98D", name: "Bay Leaf / Hoja de Laurel" }, { hex: "#7DC8F7", name: "Malibu / Malibú" },
    { hex: "#7DD8C6", name: "Bermuda / Bermudas" }, { hex: "#7E3A15", name: "Copper Canyon / Cañón de Cobre" }, { hex: "#7F1734", name: "Claret / Clarete" },
    { hex: "#7F3A02", name: "Peru Tan / Bronceado Perú" }, { hex: "#7F626D", name: "Falcon / Halcón" }, { hex: "#7F7589", name: "Mobster / Mafioso" },
    { hex: "#7F76D3", name: "Moody Blue / Azul Malhumorado" }, { hex: "#7FFF00", name: "Chartreuse / Cartujo" }, { hex: "#7FFFD4", name: "Aquamarine / Aguamarina" },
    { hex: "#800000", name: "Maroon / Granate" }, { hex: "#800B47", name: "Rose Bud Cherry / Cereza Capullo de Rosa" }, { hex: "#801818", name: "Falu Red / Rojo Falu" },
    { hex: "#80341F", name: "Red Robin / Petirrojo" }, { hex: "#803790", name: "Vivid Violet / Violeta Vívido" }, { hex: "#80461B", name: "Russet / Bermejo" },
    { hex: "#807E79", name: "Friar Gray / Gris Fraile" }, { hex: "#808000", name: "Olive / Oliva" }, { hex: "#808080", name: "Gray / Gris" },
    { hex: "#80B3AE", name: "Gulf Stream / Corriente del Golfo" }, { hex: "#80B3C4", name: "Glacier / Glaciar" }, { hex: "#80CCEA", name: "Seagull / Gaviota" },
    { hex: "#81422C", name: "Nutmeg / Nuez Moscada" }, { hex: "#816E71", name: "Spicy Pink / Rosa Picante" }, { hex: "#817377", name: "Empress / Emperatriz" },
    { hex: "#819885", name: "Spanish Green / Verde Español" }, { hex: "#826F65", name: "Sand Dune / Duna de Arena" }, { hex: "#828685", name: "Gunsmoke / Humo de Pistola" },
    { hex: "#828F72", name: "Battleship Gray / Gris Acorazado" }, { hex: "#831923", name: "Merlot / Merlot" }, { hex: "#837050", name: "Shadow / Sombra" },
    { hex: "#83AA5D", name: "Chelsea Cucumber / Pepino Chelsea" }, { hex: "#83D0C6", name: "Monte Carlo / Monte Carlo" }, { hex: "#843179", name: "Plum / Ciruela" },
    { hex: "#84A0A0", name: "Granny Smith / Manzana Granny Smith" }, { hex: "#8581D9", name: "Chetwode Blue / Azul Chetwode" }, { hex: "#858470", name: "Bandicoot / Bandicut" },
    { hex: "#859FAF", name: "Bali Hai / Bali Hai" }, { hex: "#85C4CC", name: "Half Baked / A Medio Cocer" }, { hex: "#860111", name: "Red Devil / Diablo Rojo" },
    { hex: "#863C3C", name: "Lotus / Loto" }, { hex: "#86483C", name: "Ironstone / Piedra de Hierro" }, { hex: "#864D1E", name: "Bull Shot / Disparo de Toro" },
    { hex: "#86560A", name: "Rusty Nail / Clavo Oxidado" }, { hex: "#8689EB", name: "Bitter / Amargo" }, { hex: "#86949F", name: "Regent Gray / Gris Regente" },
    { hex: "#871550", name: "Disco / Disco" }, { hex: "#873260", name: "Americano / Americano" }, { hex: "#87756E", name: "Hurricane / Huracán" },
    { hex: "#877C7B", name: "Oslo Gray / Gris Oslo" }, { hex: "#878D91", name: "Sushi / Sushi" }, { hex: "#87AB39", name: "Spicy Mix / Mezcla Picante" },
    { hex: "#88421D", name: "Kumera / Batata" }, { hex: "#885342", name: "Suva Gray / Gris Suva" }, { hex: "#886221", name: "Avocado / Aguacate" },
    { hex: "#888387", name: "Camelot / Camelot" }, { hex: "#888D65", name: "Solid Pink / Rosa Sólido" }, { hex: "#893456", name: "Cannon Pink / Rosa Cañón" },
    { hex: "#893843", name: "Makara / Makara" }, { hex: "#894367", name: "Burnt Umber / Sombra Tostada" }, { hex: "#897D6D", name: "True V / V Verdadera" },
    { hex: "#8A3324", name: "Clay Creek / Arroyo de Arcilla" }, { hex: "#8A73D6", name: "Monsoon / Monzón" }, { hex: "#8A8360", name: "Stack / Pila" },
    { hex: "#8A8389", name: "Jordy Blue / Azul Jordy" }, { hex: "#8A8F8A", name: "Maguey / Maguey" }, { hex: "#8AB9F1", name: "Electric Violet / Violeta Eléctrico" },
    { hex: "#8B00FF", name: "Violet / Violeta" }, { hex: "#8B0723", name: "Red Strawberry / Rojo Fresa" }, { hex: "#8B6B0B", name: "Raa / Raa" },
    { hex: "#8B8470", name: "Natural Gray / Gris Natural" }, { hex: "#8B847E", name: "Mantle / Manto" }, { hex: "#8B8680", name: "Portage / Transporte" },
    { hex: "#8B9C90", name: "Envy / Envidia" }, { hex: "#8B9FEE", name: "Cascade / Cascada" }, { hex: "#8BA690", name: "Riptide / Corriente Revuelta" },
    { hex: "#8BA9A5", name: "Cardinal Pink / Rosa Cardenal" }, { hex: "#8BE6D8", name: "Mule Fawn / Cervatillo Mula" }, { hex: "#8C055E", name: "Potters Clay / Arcilla de Alfarero" },
    { hex: "#8C472F", name: "Trendy Pink / Rosa de Moda" }, { hex: "#8C5738", name: "Paprika / Pimentón" }, { hex: "#8C6495", name: "Sanguine Brown / Marrón Sanguíneo" },
    { hex: "#8D0226", name: "Tosca / Tosca" }, { hex: "#8D3D38", name: "Cement / Cemento" }, { hex: "#8D3F3F", name: "Granite Green / Verde Granito" },
    { hex: "#8D7662", name: "Manatee / Manatí" }, { hex: "#8D8998", name: "Polo Blue / Azul Polo" }, { hex: "#8D90A1", name: "Red Berry / Baya Roja" },
    { hex: "#8DA8CC", name: "Rope / Cuerda" }, { hex: "#8E0000", name: "Opium / Opio" }, { hex: "#8E4D1E", name: "Domino / Dominó" },
    { hex: "#8E6F70", name: "Mamba / Mamba" }, { hex: "#8E775E", name: "Nepal / Nepal" }, { hex: "#8E8190", name: "Pohutukawa / Pohutukawa" },
    { hex: "#8EABC1", name: "El Salva / El Salva" }, { hex: "#8F021C", name: "Korma / Korma" }, { hex: "#8F3E33", name: "Squirrel / Ardilla" },
    { hex: "#8F4B0E", name: "Vista Blue / Azul Vista" }, { hex: "#8F8176", name: "Burgundy / Borgoña" }, { hex: "#8FD6B4", name: "Old Brick / Ladrillo Viejo" },
    { hex: "#900020", name: "Hemp / Cáñamo" }, { hex: "#901E1E", name: "Almond Frost / Escarcha de Almendra" }, { hex: "#907874", name: "Sycamore / Sicomoro" },
    { hex: "#907B71", name: "Sangria / Sangría" }, { hex: "#908D39", name: "Cumin / Comino" }, { hex: "#92000A", name: "Beaver / Castor" },
    { hex: "#924321", name: "Stonewall / Muro de Piedra" }, { hex: "#926F5B", name: "Venus / Venus" }, { hex: "#928573", name: "Medium Purple / Púrpura Medio" },
    { hex: "#928590", name: "Cornflower / Aciano" }, { hex: "#9370DB", name: "Algae Green / Verde Alga" }, { hex: "#93CCEA", name: "Copper Rust / Óxido de Cobre" },
    { hex: "#93DFB8", name: "Arrowtown / Arrowtown" }, { hex: "#944747", name: "Scarlett / Escarlata" }, { hex: "#948771", name: "Strikemaster / Strikemaster" },
    { hex: "#950015", name: "Mountain Mist / Niebla de Montaña" }, { hex: "#956387", name: "Carmine / Carmín" }, { hex: "#959396", name: "Brown / Marrón" },
    { hex: "#960018", name: "Leather / Cuero" }, { hex: "#964B00", name: "Purple Mountain's Majesty / Majestad de la Montaña Púrpura" }, { hex: "#967059", name: "Lavender Purple / Púrpura Lavanda" },
    { hex: "#9678B6", name: "Pewter / Peltre" }, { hex: "#967BB6", name: "Summer Green / Verde Verano" }, { hex: "#96A8A1", name: "Au Chico / Au Chico" },
    { hex: "#96BBAB", name: "Wisteria / Glicina" }, { hex: "#97605D", name: "Atlantis / Atlántida" }, { hex: "#9771B5", name: "Vin Rouge / Vino Tinto" },
    { hex: "#97CD2D", name: "Lilac Bush / Arbusto de Lila" }, { hex: "#983D61", name: "Bazaar / Bazar" }, { hex: "#9874D3", name: "Hacienda / Hacienda" },
    { hex: "#98777B", name: "Pale Oyster / Ostra Pálida" }, { hex: "#98811B", name: "Mint Green / Verde Menta" }, { hex: "#988D77", name: "Fresh Eggplant / Berenjena Fresca" },
    { hex: "#98FF98", name: "Violet Red / Rojo Violeta" }, { hex: "#990066", name: "Tamarillo / Tamarillo" }, { hex: "#991199", name: "Totem Pole / Tótem" },
    { hex: "#991613", name: "Copper / Cobre" }, { hex: "#991B07", name: "Pacific Blue / Azul Pacífico" }, { hex: "#996666", name: "Mountbatten Pink / Rosa Mountbatten" },
    { hex: "#9966CC", name: "Blue Bell / Campanilla Azul" }, { hex: "#997A8D", name: "Prairie Sand / Arena de Pradera" }, { hex: "#9999CC", name: "Purple Mimosa / Mimosa Púrpura" },
    { hex: "#9A3820", name: "Strikemaster / Strikemaster" }, { hex: "#9A6E61", name: "Haki / Haki" }, { hex: "#9AA000", name: "Yellow Green / Verde Amarillo" },
    { hex: "#9AB973", name: "Grown Early / Cultivado Temprano" }, { hex: "#9ACD32", name: "Wisteria / Glicina" }, { hex: "#9AD3DE", name: "Grey Chateau / Castillo Gris" },
    { hex: "#9B4703", name: "Orange Roughy / Reloj Anaranjado" }, { hex: "#9B7653", name: "Dirt / Suciedad" }, { hex: "#9B9E8F", name: "Lemon Grass / Hierba de Limón" },
    { hex: "#9C3336", name: "Rock Blue / Azul Roca" }, { hex: "#9D5616", name: "Morning Glory / Gloria de la Mañana" }, { hex: "#9DACB7", name: "Cognac / Coñac" },
    { hex: "#9DE5FF", name: "Reef Gold / Oro de Arrecife" }, { hex: "#9E3332", name: "Star Dust / Polvo de Estrellas" }, { hex: "#9EA587", name: "Santas Gray / Gris de Santa" },
    { hex: "#9EA91F", name: "Sinbad / Simbad" }, { hex: "#9EB1CD", name: "Feijoa / Feijoa" }, { hex: "#9EDEE0", name: "Tabasco / Tabasco" },
    { hex: "#9F381D", name: "Buttered Rum / Ron con Mantequilla" }, { hex: "#9F821C", name: "Citron / Cidra" }, { hex: "#9F9F9C", name: "Oak Wood / Madera de Roble" },
    { hex: "#9FA0B1", name: "Zhuba / Zhuba" }, { hex: "#9FD7D3", name: "Green Earth / Tierra Verde" }, { hex: "#A02712", name: "Cape Palliser / Cabo Palliser" },
    { hex: "#A1750D", name: "Gray Nurse / Enfermera Gris" }, { hex: "#A1ADB5", name: "Loose Button / Botón Suelto" }, { hex: "#A1C50A", name: "Citrus / Cítrico" },
    { hex: "#A2006D", name: "Flirt / Coqueteo" }, { hex: "#A23B6C", name: "Rouge / Colorete" }, { hex: "#A26645", name: "Cape Palliser / Cabo Palliser" },
    { hex: "#A2AAB3", name: "Gray Nurse / Enfermera Gris" }, { hex: "#A2AD9C", name: "Loose Button / Botón Suelto" }, { hex: "#A2CFFE", name: "Fresh Air / Aire Fresco" },
    { hex: "#A3807B", name: "Iron / Hierro" }, { hex: "#A397B4", name: "Amethyst Smoke / Humo de Amatista" }, { hex: "#A3E3ED", name: "Blizzard Blue / Azul Ventisca" },
    { hex: "#A4A49D", name: "Delta / Delta" }, { hex: "#A4A6D3", name: "Wistful / Melancólico" }, { hex: "#A4AF6E", name: "Green Smoke / Humo Verde" },
    { hex: "#A50B5E", name: "Jazzberry Jam / Mermelada de Jazzberry" }, { hex: "#A59B91", name: "Zorba / Zorba" }, { hex: "#A5CE10", name: "Bahia / Bahía" },
    { hex: "#A62F20", name: "Roof Terracotta / Terracota de Techo" }, { hex: "#A65529", name: "Paarl / Paarl" }, { hex: "#A68B5B", name: "Barley Corn / Grano de Cebada" },
    { hex: "#A69279", name: "Donkey Brown / Marrón Burro" }, { hex: "#A6A29A", name: "Dawn / Amanecer" }
];

// Combine NTC list with simple list
const extendedColorList = [
    ...colorList,
    // Add more common ones if missing
    { hex: "#FF0000", name: "Red / Rojo" }, { hex: "#00FF00", name: "Lime / Lima" }, { hex: "#0000FF", name: "Blue / Azul" },
    { hex: "#FFFF00", name: "Yellow / Amarillo" }, { hex: "#00FFFF", name: "Cyan / Cian" }, { hex: "#FF00FF", name: "Magenta / Magenta" },
    { hex: "#C0C0C0", name: "Silver / Plata" }, { hex: "#808080", name: "Gray / Gris" }, { hex: "#800000", name: "Maroon / Granate" },
    { hex: "#808000", name: "Olive / Oliva" }, { hex: "#008000", name: "Green / Verde" }, { hex: "#800080", name: "Purple / Púrpura" },
    { hex: "#008080", name: "Teal / Cerceta" }, { hex: "#000080", name: "Navy / Azul Marino" }, { hex: "#FFFFFF", name: "White / Blanco" }
];


// Pre-calculate RGB values for optimized searching
const colorListRgb = extendedColorList.map(c => {
    const rgb = hexToRgb(c.hex);
    return { ...c, r: rgb.r, g: rgb.g, b: rgb.b };
});

export const getColorName = (hex) => {
    const inputRgb = hexToRgb(hex);
    if (!inputRgb) return "Color Desconocido";

    let minDistance = Infinity;
    let closestColorName = "Color Desconocido";

    // Nearest Neighbor Algorithm (Euclidean Distance in RGB)
    for (const color of colorListRgb) {
        if (!color.r) continue; // Skip invalid

        const dR = inputRgb.r - color.r;
        const dG = inputRgb.g - color.g;
        const dB = inputRgb.b - color.b;

        // Squared distance is enough for comparison (avoids sqrt)
        const distanceSq = (dR * dR) + (dG * dG) + (dB * dB);

        if (distanceSq < minDistance) {
            minDistance = distanceSq;
            closestColorName = color.name;
        }
    }

    return closestColorName;
};

/**
 * Returns the human-readable Spanish color family name for a given HEX color.
 * Uses the same HSL mapping logic as the backend color-utils.ts so both platforms are consistent.
 * @param {string} hex - Color in #RRGGBB format
 * @returns {string} e.g. "Azul", "Verde", "Rojo"
 */
export const getColorFamily = (hex) => {
    if (!hex || !hex.startsWith('#')) return 'Desconocido';

    const rgb = hexToRgb(hex);
    if (!rgb) return 'Desconocido';

    // Convert RGB to HSL
    const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);

    if (l <= 8) return 'Negro';
    if (l >= 92) return 'Blanco';
    if (s <= 10) return 'Gris';

    if (h >= 0 && h < 15) return 'Rojo';
    if (h >= 15 && h < 45) return 'Naranja';
    if (h >= 45 && h < 70) return 'Amarillo';
    if (h >= 70 && h < 155) return 'Verde';
    if (h >= 155 && h < 195) return 'Cian';
    if (h >= 195 && h < 265) return 'Azul';
    if (h >= 265 && h < 295) return 'Morado';
    if (h >= 295 && h < 345) return 'Rosa';
    return 'Rojo';
};
