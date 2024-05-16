import express from 'express';
import Data from "../schemas/product.schema.js";

const router = express.Router();

// 상품 생성 api
router.post("/products", async (req, res, next) => {
    try {
        const { name, description, manager, password } = req.body;
        const product = new Data({ name, description, manager, password });
        product.updatedAt = Date.now();
        product.createdAt = Date.now();
        await product.save();

        return res
            .status(201)
            .json({
                status: "201",
                message: "상품 등록 성공",
                data: product,
            });
    } catch (err) {
        next(err);
        return res.status(500).json({
            message: "에러 발생. 관리자에게 문의할 것.",
        });
    }
});

// 상품 목록 조회 api
router.get("/products", async (req, res) => {
    try {
        const pdt_datas = await Data.find({}, "-password")
            .sort({ updatedAt: -1 })
            .select("name description manager state createdAt updatedAt")
            .exec();
        return res.status(200).json({
            status: 200,
            message: "상품 목록 조회 성공.",
            data: pdt_datas,
        });
    } catch (err) {
        next(err);
        return res.status(500).json({
            status: 500,
            message: "에러 발생. 관리자에게 문의할 것.",
        });
    }
});
// 상품 상세 조회 api
router.get("/products/:_Id", async (req, res) => {
    const { _Id } = req.params;
    try {
        const pdt_datas = await Data.findById(_Id, "-password")
            .select("name description manager state createdAt updatedAt")
            .exec();
        if (!pdt_datas) {
            return res
                .status(404)
                .json({ status: 404, message: "상품 존재 X." });
        }
        res.status(200).json({
            status: 200,
            message: "상품 상세 조회 성공.",
            data: pdt_datas,
        });
    } catch (err) {
        next(err);
        return res.status(500).json({
            status: 500,
            message: "에러 발생. 관리자에게 문의할 것.",
        });
    }
});

// 상품 수정 api
router.put("/products/:_Id", async (req, res) => {
    const { _Id } = req.params;
    try {
        const { name, description, manager, state, password } = req.body;
        const product = await Data.findById(_Id).exec();
        if (!product) {
            return res
                .status(404)
                .json({ status: 404, message: "상품 존재 X." });
        }
        if (password !== product.password) {
            return res
                .status(401)
                .json({ status: 401, message: "비밀번호가 일치 X" });
        }
        product.name = name;
        product.description = description;
        product.manager = manager;
        product.state = state;
        product.password = password;

        product.updatedAt = Date.now();
        await product.save();
        return res
            .status(200)
            .json({
                status: 200,
                message: "상품 수정 성공.",
                data: product,
            });
    } catch (err) {
        next(err);
        return res
            .status(500)
            .json({
                error: "에러 발생. 관리자에게 문의할 것.",
            });
    }
});

//상품 삭제 api
router.delete("/products/:_Id", async (req, res) => {
    const { _Id } = req.params;
    try {
        const { password } = req.body;
        const product = await Data.findById(_Id).exec();
        if (!product) {
            return res
                .status(404)
                .json({ status: 404, message: "상품 존재 X" });
        }
        if (!password) {
            return res
                .status(400)
                .json({ status: 400, message: "비밀번호 입력 요망." });
        }
        if (password !== product.password) {
            return res
                .status(400)
                .json({ status: 400, message: "비밀번호 일치 X" });
        }
        await product.deleteOne();
        return res
            .status(200)
            .json({
                status: "200",
                message: "상품 삭제 성공.",
                data: product,
            });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({
                error: "에러 발생. 관리자에게 문의할 것.",
            });
    }
});
export default router;