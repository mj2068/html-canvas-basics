class Vector {
    x: number = 0;
    y: number = 0;

    constructor(asObject: { x: number; y: number });
    constructor(asArray: [number, number]);
    constructor(x: number, y: number);
    constructor(
        arg1: number | { x: number; y: number } | [number, number],
        arg2?: number,
    ) {
        if (arg2 !== undefined && arg2 !== null) {
            this.x = arg1 as number;
            this.y = arg2;
        } else if (Array.isArray(arg1)) {
            // argument passed in as array
            this.x = arg1[0];
            this.y = arg1[1];
        } else if ("object" === typeof arg1) {
            // argument passed in as object
            this.x = arg1.x;
            this.y = arg1.y;
        } else {
            throw new Error("what did you pass in?");
        }
    }

    static subtract(v1: Vector, v2: Vector) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    static add(v1: Vector, v2: Vector) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }

    static scale(v: Vector, scalar: number) {
        return new Vector(v.x * scalar, v.y * scalar);
    }

    static dot(v1: Vector, v2: Vector) {
        return v1.x * v2.x + v1.y * v2.y;
    }

    static distance(v1: Vector, v2: Vector) {
        return Vector.subtract(v1, v2).magnitude;
    }

    static normalizedOf(v: Vector) {
        return v.toNormalized();
    }

    get tuple(): [number, number] {
        return [this.x, this.y];
    }

    get magnitude() {
        return Math.hypot(this.x, this.y);
    }

    toNormalized() {
        const m = this.magnitude;
        if (m < Number.EPSILON * 1e3) {
            return new Vector(0, 0);
        } else {
            return Vector.scale(this, 1 / m);
        }
    }

    normalize() {
        const m = this.magnitude;
        this.x = this.x * (1 / m);
        this.y = this.y * (1 / m);
    }

    distanceTo(target: Vector) {
        return Vector.distance(target, this);
    }
}

export { Vector as default, Vector };
